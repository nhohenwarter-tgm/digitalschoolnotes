from requests_oauthlib import OAuth2Session
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings

# This information is obtained upon registration of a new GitHub
google_authorization_base_url = 'https://accounts.google.com/o/oauth2/auth'
google_token_url = 'https://accounts.google.com/o/oauth2/token'


def oauth_google_request(request):
    scope = ['https://www.googleapis.com/auth/userinfo.email',
             'https://www.googleapis.com/auth/userinfo.profile']
    google = OAuth2Session(settings.OAUTH_GOOGLE_PUB, scope=scope, redirect_uri = build_request_uri(request)+"/api/oauth/google/response")
    authorization_url, state = google.authorization_url(google_authorization_base_url)
    request.session['oauth_state']=state

    return redirect(authorization_url)

def oauth_google_callback(request):
    build_response_uri(request)
    google = OAuth2Session(settings.OAUTH_GOOGLE_PUB, state=request.session['oauth_state'])
    token = google.fetch_token(google_token_url, client_secret=settings.OAUTH_GOOGLE_PRIV,
                               authorization_code=build_response_uri(request))

    return JsonResponse(google.get('https://api.github.com/user').json())

def build_response_uri(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    baseurl = "https://digitalschoolnotes.com:"+str(int(request.META['SERVER_PORT'])-3000) + "/api/oauth/google/response"
    baseurl += "?state="+state+"&code="+code+"#"

def build_request_uri(request):
    return "https://digitalschoolnotes.com:"+str(int(request.META['SERVER_PORT'])-3000)
