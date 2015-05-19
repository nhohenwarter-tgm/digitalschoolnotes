from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render, redirect, render_to_response
from dsn.authentication.registration import register_user, validate_registration
from dsn.forms import RegistrationForm
import json

def view_mainpage(request):
    """
    Rendert das Template für die Haupt-Seite (ohne Inhalt - nur Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    #return render_to_response('/../static/templates/index.html')
    return JsonResponse({'message': 'success'})

def view_mainpage_content(request):
    """
    Rendert das Teil-Template für den Inhalt der Haupt-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    reg = view_registration(request)
    print(request.method)
    return render(request, '../static/templates/mainpage/mainpage_content.html', reg)

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

def view_resetPassword(request):
    """
    Rendert das Teil-Template für die Account Einstellungen der Management-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if request.method == 'POST':
        # TODO Validate & Create Token
        pass
    else:
        return render(request, 'main_page/../../templates/mainpage/reset_password.html', {})

def view_test(request):
    """
    Rendert das Teil-Template für die Account Einstellungen der Management-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if request.method=='POST':
        return JsonResponse({'message':'success'})
    return render(request, 'test.html', {})