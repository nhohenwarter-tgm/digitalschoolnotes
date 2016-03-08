from django.shortcuts import redirect
from django.http import HttpResponseForbidden, JsonResponse, HttpResponse, HttpResponseRedirect
from django.conf import settings
from uuid import uuid4
import urllib, json
from dsn.models import User
from mongoengine import DoesNotExist
import requests
from django.contrib.auth import login

def build_request_uri(request):
    """
    Erstellt die Redirect URI abhängig vom Port der Anfrage
    :param request:
    :return: URI als String
    """
    print(str(int(request.META['SERVER_PORT'])-3000))
    return "https://digitalschoolnotes.com"

def oauth_google_request(request):
    """
    Fragt den User, ob er DSN rechte auf seinen Google Account geben will
    :param request:
    :return: Redirect zur Anfrage
    """
    uri = build_request_uri(request)+"/api/oauth/google/response"

    #state for csrf protection
    state = str(uuid4())
    request.session['state'] = state

    #scope, welche daten will ich?
    scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

    #build request
    params = {
        'client_id':settings.OAUTH_GOOGLE_PUB,
        'response_type': 'code',
        'redirect_uri': uri,
        'state':state,
        'scope':scope
    }

    return "https://accounts.google.com/o/oauth2/auth?" + urllib.parse.urlencode(params)

def oauth_google_callback(request):
    """
    Holt sich die Tokens und greift auf Googles daten zu
    :param request:
    :return: Daten als JSON oder 403
    """

    # csrf test
    state = request.GET.get('state')
    if state == request.session['state']:
        uri = build_request_uri(request)+"/api/oauth/google/response"
        code = request.GET.get('code')

        #Anfrage nach Tokens bauen
        data = {
            'client_id':settings.OAUTH_GOOGLE_PUB,
            'client_secret': settings.OAUTH_GOOGLE_PRIV,
            'code':code,
            'redirect_uri': uri,
            'grant_type': 'authorization_code'
        }
        #Token holen
        token_response = requests.post("https://www.googleapis.com/oauth2/v3/token", data=data).json()
        access_token = str(token_response.get('access_token'))

        #Google nach Userdaten fragen
        headers = {'Authorization': "Bearer "+access_token}
        response = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers=headers).json()

        userdata = uniformUserdata('google', response)
        exists = checkifuserexists(userdata)
        oauth = checkifuserhasoauth(userdata)
        if exists and oauth:
            return oauthlogin(request, userdata)
        elif exists and not oauth:
            return build_request_uri(request)+"/login/oautherror"
        else:
            return oauthregister(request, userdata)

    else:
        return HttpResponseForbidden()

def oauth_fb_request(request):
    """
    Fragt den User, ob er DSN rechte auf seinen FB Account geben will
    :param request:
    :return: Redirect zur Anfrage
    """
    uri = build_request_uri(request)+"/api/oauth/fb/response"

    #state for csrf protection
    state = str(uuid4())
    request.session['state'] = state

    #scope, welche daten will ich?
    scope = 'email, public_profile'

    #build request
    params = {
        'client_id':settings.OAUTH_FB_PUB,
        'response_type': 'code',
        'redirect_uri': uri,
        'state':state,
        'scope':scope
    }
    return "https://www.facebook.com/dialog/oauth/?" + urllib.parse.urlencode(params)

def oauth_fb_callback(request):
    """
    Holt sich die Tokens und greift auf FBs daten zu
    :param request:
    :return: Daten als JSON oder 403
    """

    # csrf test
    state = request.GET.get('state')
    if state == request.session['state']:
        uri = build_request_uri(request)+"/api/oauth/fb/response"
        code = request.GET.get('code')
        #Anfrage nach Tokens bauen
        data = {
            'client_id':settings.OAUTH_FB_PUB,
            'redirect_uri': uri,
            'client_secret': settings.OAUTH_FB_PRIV,
            'code':code
        }
        #Token holen
        uri = "https://graph.facebook.com/v2.3/oauth/access_token?"+urllib.parse.urlencode(data)
        token_response = requests.get(uri).json()
        access_token = str(token_response.get('access_token'))

        #FB nach Userdaten fragen
        response = requests.get("https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token="+access_token).json()

        userdata = uniformUserdata('fb', response)
        exists = checkifuserexists(userdata)
        oauth = checkifuserhasoauth(userdata)
        if exists and oauth:
            return oauthlogin(request, userdata)
        elif exists and not oauth:
            return build_request_uri(request)+"/login/oautherror"
        else:
            return oauthregister(request, userdata)
    else:
        return HttpResponseForbidden()

def uniformUserdata(provider, data):
    """
    Normalisiert die Daten welche vom OAuth provider zurueck kommen
    :param provider: Name des OAuth Providers
    :param data: Response des Providers als JSON
    :return: Dict mit Userdaten
    """
    userdata = {}
    if provider=='fb':
        userdata['first_name'] = data['first_name']
        userdata['last_name'] = data['last_name']
        userdata['email'] = data['email']
        userdata['id'] = data['id']
        userdata['provider'] = 'fb'
    else:
        userdata['first_name'] = data['given_name']
        userdata['last_name'] = data['family_name']
        userdata['email'] = data['email']
        userdata['id'] = data['id']
        userdata['provider'] = 'goole'

    return userdata

def checkifuserexists(userdata):
    """
    Prueft ob ein User existiert
    :param userdata: Userdaten
    :return: Boolean
    """
    try:
        User.objects.get(email=userdata['email'])
        return True
    except DoesNotExist:
        return False

def checkifuserhasoauth(userdata):
    """
    Prueft ob der User mit Oauth registriert wurde
    :param userdata: Userdaten
    :return: Boolean
    """
    try:
        User.objects.get(oauth__id=userdata['id'])
        return True
    except DoesNotExist:
        return False

def oauthlogin(request, userdata):
    """
    Loggt einen OAuth User ein
    :param request: Request um auf Session zugreiffen zu koennen
    :param userdata: Userdaten des Users der eingeloggt werden soll
    :return: Redirect zum geschützten Bereich
    """
    user = User.objects.get(oauth__id=userdata['id'])
    user.backend = 'mongoengine.django.auth.MongoEngineBackend'
    login(request, user)
    request.session.set_expiry(60 * 60 * 1)
    return build_request_uri(request)+"/management"


def oauthregister(request, userdata):
    """
    Registriert einen OAuth User und loggt ihn dann ein
    :param request: Request um auf Session zugreiffen zu koennen
    :param userdata: Userdaten des Users der eingeloggt werden soll
    """
    User.create_oauth_user(email=userdata['email'], first_name=userdata['first_name'],
                     last_name=userdata['last_name'], provider=userdata['provider'], id=userdata['id'])
    return oauthlogin(request, userdata)
