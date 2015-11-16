from django.shortcuts import redirect
from django.http import HttpResponseForbidden, JsonResponse, HttpResponse
from django.conf import settings
from uuid import uuid4
import urllib
import requests

def build_request_uri(request):
    """
    Erstellt die Redirect URI abhängig vom Port der Anfrage
    :param request:
    :return: URI als String
    """
    return "https://digitalschoolnotes.com:"+str(int(request.META['SERVER_PORT'])-3000)

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

    return redirect("https://accounts.google.com/o/oauth2/auth?" + urllib.parse.urlencode(params))

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

        return response

    else:
        return HttpResponseForbidden()

def oauth_fb_request(request):
    """
    Fragt den User, ob er DSN rechte auf seinen FB Account geben will
    :param request:
    :return: Redirect zur Anfrage
    """
    uri = build_request_uri(request)+"/api/oauth/fb/response"
    print("request: "+uri)

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
    print("request: https://www.facebook.com/dialog/oauth/?"+ urllib.parse.urlencode(params))
    return redirect("https://www.facebook.com/dialog/oauth/?" + urllib.parse.urlencode(params))

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
        print("callback: "+uri)
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
        print(access_token)

        #FB nach Userdaten fragen
        response = requests.get("https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token="+access_token).json()

        return JsonResponse({'response':response})

    else:
        return HttpResponseForbidden()