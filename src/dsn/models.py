from mongoengine import *
from mongoengine.django.auth import UserManager, Permission, make_password, check_password, SiteProfileNotAvailable, \
    _user_get_all_permissions, _user_has_module_perms, _user_has_perm
from mongoengine.django import auth
from django.db import models
from bson import ObjectId
import datetime

from dsn.settings import SALT


class AuthUserManager(UserManager):

    def create_user(self, email, password, first_name, last_name):
        if email and password:
            try:
                User.objects.get(email=email)
                return None
            except DoesNotExist:
                try:
                    email_name, domain_part = email.strip().split('@', 1)
                except ValueError:
                    pass
                else:
                    email = '@'.join([email_name, domain_part.lower()])

                user = User(username=email, email=email, first_name=first_name, last_name=last_name)
                user.set_password(password)
                user.save()
                return user
        else:
            return None

    def create_superuser(self, email, password, first_name, last_name):
        if email and password:
            try:
                User.objects.get(email=email)
                return None
            except DoesNotExist:
                try:
                    email_name, domain_part = email.strip().split('@', 1)
                except ValueError:
                    pass
                else:
                    email = '@'.join([email_name, domain_part.lower()])

                user = User(email=email, is_superuser=True, first_name=first_name, last_name=last_name)
                user.set_password(password)
                user.save()
                return user
        else:
            return None


class PasswordReset(EmbeddedDocument):
    hash = StringField(required=True)
    date = DateTimeField(required=True)


class OAuth(EmbeddedDocument):
    provider = StringField(required=True)
    id = StringField(required=True)


class User(Document):
    id = ObjectIdField(unique=True, required=True, primary_key=True)
    email = EmailField(unique=True, required=True)
    first_name = StringField(max_length=30)
    last_name = StringField(max_length=30)
    password = StringField(max_length=128)
    is_staff = BooleanField(default=False)
    is_prouser = BooleanField(default=False)
    is_active = BooleanField(default=False)
    is_superuser = BooleanField(default=False)
    last_login = DateTimeField(default=datetime.datetime.now())
    date_joined = DateTimeField(default=datetime.datetime.now())
    delete_date = DateTimeField()
    passwordreset = EmbeddedDocumentField(PasswordReset)
    oauth = EmbeddedDocumentField(OAuth)
    validatetoken = StringField()

    user_permissions = ListField(ReferenceField(Permission))

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['last_name', 'first_name']

    meta = {
        'allow_inheritance': True,
        'indexes': [
            {'fields': ['email'], 'unique': True, 'sparse': True}
        ]
    }

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        """Returns the users first and last names, separated by a space.
        """
        full_name = '%s %s' % (self.first_name or '', self.last_name or '')
        return full_name.strip()

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def set_password(self, raw_password):
        """Sets the user's password - always use this rather than directly
        assigning to :attr:`~mongoengine.django.auth.User.password` as the
        password is hashed before storage.
        """
        self.password = make_password(raw_password)
        self.save()
        return self

    def check_password(self, raw_password):
        """Checks the user's password against a provided password - always use
        this rather than directly comparing to
        :attr:`~mongoengine.django.auth.User.password` as the password is
        hashed before storage.
        """
        return check_password(raw_password, self.password)

    @classmethod
    def create_user(cls, email, password, first_name, last_name):
        """Create (and save) a new user with the given password and
        email address.
        """
        now = datetime.datetime.now()

        # Normalize the address by lowercasing the domain part of the email
        # address.
        if email is not None:
            try:
                email_name, domain_part = email.strip().split('@', 1)
            except ValueError:
                pass
            else:
                email = '@'.join([email_name.lower(), domain_part.lower()])

        user = cls(id=ObjectId(), email=email, date_joined=now, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        return user

    @classmethod
    def create_oauth_user(cls, email, first_name, last_name, provider, id):
        """Create (and save) a new user with the given password and
        email address.
        """
        now = datetime.datetime.now()

        # Normalize the address by lowercasing the domain part of the email
        # address.
        if email is not None:
            try:
                email_name, domain_part = email.strip().split('@', 1)
            except ValueError:
                pass
            else:
                email = '@'.join([email_name.lower(), domain_part.lower()])

        user = cls(id=ObjectId(), email=email, date_joined=now, first_name=first_name, last_name=last_name)
        user.set_password("")

        oauth = OAuth(provider=provider, id=id)
        user.is_active=True
        user.oauth=oauth
        user.save()
        return user

    def get_group_permissions(self, obj=None):
        """
        Returns a list of permission strings that this user has through his/her
        groups. This method queries all available auth backends. If an object
        is passed in, only permissions matching this object are returned.
        """
        permissions = set()
        for backend in auth.get_backends():
            if hasattr(backend, "get_group_permissions"):
                permissions.update(backend.get_group_permissions(self, obj))
        return permissions

    def get_all_permissions(self, obj=None):
        return _user_get_all_permissions(self, obj)

    def has_perm(self, perm, obj=None):
        """
        Returns True if the user has the specified permission. This method
        queries all available auth backends, but returns immediately if any
        backend returns True. Thus, a user who has permission from a single
        auth backend is assumed to have permission in general. If an object is
        provided, permissions for this specific object are checked.
        """

        # Active superusers have all permissions.
        if self.is_active and self.is_superuser:
            return True

        # Otherwise we need to check the backends.
        return _user_has_perm(self, perm, obj)

    def has_module_perms(self, app_label):
        """
        Returns True if the user has any permissions in the given app label.
        Uses pretty much the same logic as has_perm, above.
        """
        # Active superusers have all permissions.
        if self.is_active and self.is_superuser:
            return True

        return _user_has_module_perms(self, app_label)

    def email_user(self, subject, message, from_email=None):
        "Sends an e-mail to this User."
        from django.core.mail import send_mail
        send_mail(subject, message, from_email, [self.email])

    def get_profile(self):
        """
        Returns site-specific profile for this user. Raises
        SiteProfileNotAvailable if this site does not allow profiles.
        """
        if not hasattr(self, '_profile_cache'):
            from django.conf import settings
            if not getattr(settings, 'AUTH_PROFILE_MODULE', False):
                raise SiteProfileNotAvailable('You need to set AUTH_PROFILE_MO'
                                              'DULE in your project settings')
            try:
                app_label, model_name = settings.AUTH_PROFILE_MODULE.split('.')
            except ValueError:
                raise SiteProfileNotAvailable('app_label and model_name should'
                        ' be separated by a dot in the AUTH_PROFILE_MODULE set'
                        'ting')

            try:
                model = models.get_model(app_label, model_name)
                if model is None:
                    raise SiteProfileNotAvailable('Unable to load the profile '
                        'model, check AUTH_PROFILE_MODULE in your project sett'
                        'ings')
                self._profile_cache = model._default_manager.using(self._state.db).get(user__id__exact=self.id)
                self._profile_cache.user = self
            except (ImportError, ImproperlyConfigured):
                raise SiteProfileNotAvailable
        return self._profile_cache


class NotebookContent(EmbeddedDocument):
    id = IntField()
    art = StringField()
    position_x = IntField()
    position_y = IntField()
    position_site = IntField()
    data = DictField()
    is_active = BooleanField(default=False)
    is_active_by = EmailField()


class Notebook(Document):
    name = StringField(max_length=30)
    is_public = BooleanField(default=False)
    create_date = DateTimeField(default=datetime.datetime.now())
    last_change = DateTimeField(default=datetime.datetime.now())
    email = EmailField()
    numpages = IntField(default=2)
    current_page = IntField(default=2)
    content = SortedListField(EmbeddedDocumentField(NotebookContent), ordering="id", reverse=True)
    collaborator = ListField(EmailField())

class TimeTableTime(EmbeddedDocument):
    row=IntField()
    start= StringField()
    end=StringField()


class TimeTableField(EmbeddedDocument):
    id=IntField()
    subject= StringField()
    teacher=StringField()
    room=StringField()
    notebook=StringField()


class TimeTable(Document):
    email=EmailField()
    times=EmbeddedDocumentListField(TimeTableTime)
    fields=EmbeddedDocumentListField(TimeTableField)

class NotebookLog(Document):
    notebook_id = ObjectIdField()
    user = EmailField()
    last_ping = DateTimeField()

