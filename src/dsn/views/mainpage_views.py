from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.core.urlresolvers import reverse
from dsn.authentication.registration import register_user, validate_registration
from dsn.forms import RegistrationForm

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
    reg = view_registration(request)
    print(request.method)
    return render(request, 'mainpage/mainpage_content.html', reg)

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
    if request.method == "POST":
        form = RegistrationForm()
        form.accepted = request.POST['accept']
        form.email = request.POST['email']
        form.firstname = request.POST['firstname']
        form.lastname = request.POST['lastname']
        form.password = request.POST['pwd']
        form.password_repeat = request.POST['pwd_repeat']
        if form.is_valid():
            val = validate_registration(form.email, form.password, form.password_repeat)
            if val is True:
                register_user(request.POST['email'], request.POST['pwd'], request.POST['firstname'], request.POST['lastname'])
                return {}
            else:
                return {'registration_form': form, 'registration_error': val}
        else:
            return {'registration_form': form}
    else:
        form = RegistrationForm()
        return {'registration_form': form}