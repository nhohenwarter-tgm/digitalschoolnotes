from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_management(request):
    """
    Rendert das Template für die Management-Seiten (ohne Inhalt - nur Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, 'basic/../static/index.html', {})

def view_notebooks(request):
    """
    Rendert das Teil-Template für die Verwaltung der Hefte der Management-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/management/management_notebooks.html', {})

def view_timetable(request):
    """
    Rendert das Teil-Template für den Stundenplan der Management-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/management/management_timetable.html', {})

def view_accsettings(request):
    """
    Rendert das Teil-Template für die Account Einstellungen der Management-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/management/management_accsettings.html', {})