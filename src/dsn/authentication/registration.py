from dsn.models import User
from mongoengine import DoesNotExist


def register_user(email, password, first_name, last_name):
    user = User.create_user(username=email, password=password, email=email)
    user.last_name = last_name
    user.first_name = first_name
    user.save()

def validate_registration(email, password, password_repeat):
    try:
        User.objects.get(email=email)
        return "E-Mail Adresse bereits vergeben!"
    except DoesNotExist:
        pass
    if password != password_repeat:
        return "Passwörter stimmen nicht überein!"
    else:
        return True