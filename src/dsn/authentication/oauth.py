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
    print(request.META['SERVER_PORT'])
    baseurl = "https://digitalschoolnotes.com:"+str(int(request.META['SERVER_PORT'])-3000)
    google = OAuth2Session(settings.OAUTH_GOOGLE_PUB, scope=scope, redirect_uri = baseurl+"/api/oauth/google/response")
    authorization_url, state = google.authorization_url(google_authorization_base_url)
    request.session['oauth_state']=state

    return redirect(authorization_url)

def oauth_google_callback(request):
    google = OAuth2Session(settings.OAUTH_GOOGLE_PUB, state=request.session['oauth_state'])
    print(request.build_absolute_uri())
    token = google.fetch_token(google_token_url, client_secret=settings.OAUTH_GOOGLE_PRIV,
                               authorization_response=request.build_absolute_uri())

    return JsonResponse(google.get('https://api.github.com/user').json())