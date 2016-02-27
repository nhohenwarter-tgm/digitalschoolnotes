from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import ensure_csrf_cookie
from mongoengine import DoesNotExist
from django.utils.translation import gettext as _
from django.utils import translation
import json
import requests
from django.contrib.auth import login, logout
from dsn.authentication.oauth import oauth_google_request, oauth_google_callback, oauth_fb_callback, oauth_fb_request
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
    return JsonResponse({})


def view_getLoggedInUser(request):
    """
    :param request:
    :return:
    """
    user = request.user
    if user is not None and not user.is_anonymous():
        oauthuser = 'oauth' in user
        return JsonResponse({'user': {'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name,
                                      'is_active': user.is_active, 'is_admin': user.is_superuser,
                                      'is_prouser': user.is_prouser, 'oauth': oauthuser}})
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
        try:
            form = RegistrationForm()
            form.accepted = params['accept']
            form.email = params['email']
            form.firstname = params['firstname']
            form.lastname = params['lastname']
            form.password = params['password']
            form.password_repeat = params['password_repeat']
        except KeyError:
            print("----Someone broke the Registration!!!!---")
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
            message = _('wrong_login_credentials')
            return JsonResponse({'login_error': message})
        if user is not None and user.is_active is True and user.check_password(params['password']):
            user.backend = 'mongoengine.django.auth.MongoEngineBackend'
            login(request, user)
            request.session.set_expiry(60 * 60 * 1)  # 1 hour timeout
            return JsonResponse({})
        elif user.is_active is False:
            return JsonResponse({'login_error': u'Bitte bestätige zuerst deine E-Mail Adresse!'})
        else:
            #NOTE: E-Mail Adresse oder Passwort falsch!
            message = _("wrong_login_credentials")
            return JsonResponse({'login_error': message})
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
            return JsonResponse({})
        else:
            return JsonResponse({'reset_error': val})


def view_resetpassword(request):
    if request.method == 'POST':
        params = json.loads(request.body.decode('utf-8'))
        form = PasswordSetForm
        form.password = params['password']
        form.password_repeat = params['password_repeat']
        val = validate_newpassword(form, params['hash'])
        return JsonResponse({'reset_error': val})
    elif request.method == 'GET':
        params = request.GET.get('hash', '')
        try:
            user = User.objects.get(passwordreset__hash=params)
            return JsonResponse({'reset_error': None})
        except DoesNotExist:
            return JsonResponse({'reset_error':'Der Link ist nicht mehr gültig.\n'})


def view_validate_account(request):
    if request.method == 'POST':
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(validatetoken=params['hash'])
            user.is_active = True
            user.validatetoken = ''
            user.save()
            # NOTE: Deine E-Mail Adresse wurde erfolgreich bestätigt!
            message = _("success_validate")
            return JsonResponse({'message': message, 'success': True})
        except DoesNotExist:
            return JsonResponse({'message':'Dieser Link ist nicht gültig!', 'success': False})


def view_logout(request):
    logout(request)
    return JsonResponse({})

def view_google_oauth_request(request):
    return HttpResponseRedirect(oauth_google_request(request))

def view_google_oauth_response(request):
    return HttpResponseRedirect(oauth_google_callback(request))

def view_fb_oauth_request(request):
    url = oauth_fb_request(request)
    return HttpResponseRedirect(url)

def view_fb_oauth_response(request):
    url = oauth_fb_callback(request)
    return HttpResponseRedirect(url)

def change_language(request):
    translation.activate(json.loads(request.body.decode('utf-8'))['language'])
    request.session[translation.LANGUAGE_SESSION_KEY] = translation.get_language()
    return JsonResponse({})