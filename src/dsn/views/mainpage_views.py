from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse
from dsn.authentication.registration import register_user
from dsn.models import AuthUser
from django.contrib.auth import authenticate, login


def view_mainpage(request):
    """
    Rendert das Template für die Haupt-Seite (ohne Inhalt - nur Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, 'basic/main_page.html', {})

def view_mainpage_content(request):
    """
    Rendert das Teil-Template für den Inhalt der Haupt-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, 'mainpage/mainpage_content.html', {})

def view_login(request):
    """
    Rendert das Teil-Template für den Login-Teil der Haupt-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if request.method == "POST":
        user = authenticate(username=request.POST['email'], password=request.POST['password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                return render(request, 'management/management_timetable.html', {})
            else:
                return render(request, 'mainpage/login.html', {"error_message" : "disabled account"})
        else:
            return render(request, 'mainpage/login.html', {"error_message" : "invalid login"})
    #return render(request, 'mainpage/login.html', {"error_message" : "invalid login"})
    return render(request, 'mainpage/login.html', {})

def view_registration(request):
    """
    Rendert das Teil-Template für den Registrierungs-Teil der Haupt-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    register_user("asd","asd","asd","asd")
    return render(request, 'login.html', {})