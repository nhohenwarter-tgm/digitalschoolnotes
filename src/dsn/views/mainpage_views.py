from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.contrib.auth import login, logout

from dsn.authentication.registration import validate_registration
from dsn.forms import RegistrationForm
from dsn.models import User


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
    return JsonResponse({'user': {'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name,
                                  'is_admin': user.is_superuser, 'is_prouser': user.is_prouser}})


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
        val = validate_registration(form.email, form.password, form.password_repeat)
        if val is True:
            User.create_user(email=params['email'], password=params['password'], first_name=params['firstname'], last_name=params['lastname'])
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
        print(params['password'])
        if user is not None and user.check_password(params['password']):
            user.backend = 'mongoengine.django.auth.MongoEngineBackend'
            login(request, user)
            request.session.set_expiry(60 * 60 * 1) # 1 hour timeout
            return JsonResponse({})
        else:
            return JsonResponse({'login_error': u'E-Mail Adresse oder Passwort falsch!'})
    else:
        return JsonResponse({'login_error': u'Fehler beim Login!'})

def view_logout(request):
    logout(request)
    return JsonResponse({'message': u'Erfolgreich ausgeloggt'})
