from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse
from dsn.authentication.registration import register_user

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
    return render(request, 'login.html', {})

def view_registration(request):
    """
    Rendert das Teil-Template für den Registrierungs-Teil der Haupt-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    register_user("asd","asd","asd","asd")
    return render(request, 'login.html', {})