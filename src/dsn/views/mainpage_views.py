from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from mongoengine import DoesNotExist
import json
import requests
from django.contrib.auth import login, logout
from dsn.authentication.registration import validate_registration, create_validation_token
from dsn.authentication.password_reset import validate_passwordreset, create_passwordreset_token, validate_newpassword
from dsn.authentication.email import passwordresetmail, validationmail
from dsn.forms import RegistrationForm, PasswordResetForm, PasswordSetForm
from dsn.models import User
from ipware.ip import get_ip


@ensure_csrf_cookie
def view_csrf_get(request):
    """

    :param request:
    :return:
    """
    return JsonResponse({'message':'successssss'})


def view_getLoggedInUser(request):
    """

    :param request:
    :return:
    """
    user = request.user
    if user is not None and not user.is_anonymous():
        return JsonResponse({'user': {'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name,
                                  'is_active': user.is_active, 'is_admin': user.is_superuser, 'is_prouser': user.is_prouser}})
    else:
        return JsonResponse({'user': None})


def view_registration(request):
    """
    Registrierung
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        form = RegistrationForm()
        form.accepted = params['accept']
        form.email = params['email']
        form.firstname = params['firstname']
        form.lastname = params['lastname']
        form.password = params['password']
        form.password_repeat = params['password_repeat']
        val = validate_registration(form.email, form.password, form.password_repeat, params['recaptcha'],get_ip(request))
        if val is True:
            User.create_user(email=params['email'], password=params['password'], first_name=params['firstname'], last_name=params['lastname'])
            link = create_validation_token(params['email'])
            validationmail(params['email'], params['firstname'], link)
            return JsonResponse({})
        else:
            return JsonResponse({'registration_error': val})

def view_login(request):
    """
    Login
    :param request:
    :return:
    """
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
        except:
            user = None
        if user is not None and user.is_active is True and user.check_password(params['password']):
            user.backend = 'mongoengine.django.auth.MongoEngineBackend'
            login(request, user)
            request.session.set_expiry(60 * 60 * 1) # 1 hour timeout
            return JsonResponse({})
        elif user.is_active is False:
            return JsonResponse({'login_error': u'Bitte bestätige zuerst deine E-Mail Adresse!'})
        else:
            return JsonResponse({'login_error': u'E-Mail Adresse oder Passwort falsch!'})
    else:
        return JsonResponse({'login_error': u'Fehler beim Login!'})

def view_resetpasswordrequest(request):
    if request.method=='POST':
        params = json.loads(request.body.decode('utf-8'))
        form = PasswordResetForm()
        form.email = params['email']
        form.recaptcha = params['recaptcha']
        # http://stackoverflow.com/a/16203978 get ip
        val = validate_passwordreset(form.email, form.recaptcha, get_ip(request))
        if val is True:
            user = User.objects.get(email=form.email)
            token = create_passwordreset_token(form.email)
            passwordresetmail(form.email,user.first_name,token)
            return JsonResponse({'reset_error': 'success'})
        else:
            return JsonResponse({'reset_error': val})

def view_resetpassword(request):
    if request.method=='POST':
        params = json.loads(request.body.decode('utf-8'))
        print(params)
        form = PasswordSetForm
        form.password = params['password']
        form.password_repeat = params['password_repeat']
        val = validate_newpassword(form, params['hash'])
        return JsonResponse({'reset_error': val})

def view_validate_account(request):
    if request.method == 'POST':
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(validatetoken=params['hash'])
            user.is_active = True
            user.validatetoken = ''
            user.save()
            return JsonResponse({'message':'Deine E-Mail Adresse wurde erfolgreich bestätigt!'})
        except DoesNotExist:
            return JsonResponse({'message':'Dieser Link ist nicht gültig!'})


def view_logout(request):
    logout(request)
    return JsonResponse({})
