from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_administration(request):
    """
    Rendert das Template für die Administrations-Seiten (ohne Inhalt - nur Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, 'basic/../static/admin.html', {})

def view_usermanagement(request):
    """
    Rendert das Teil-Template für das Usermanagement der Administrations-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/admin/admin_usermanagement.html', {})

def view_bills(request):
    """
    Rendert das Teil-Template für die Rechnungen der Administrations-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/admin/admin_bills.html', {})

def view_ldap_configuration(request):
    """
    Rendert das Teil-Template für die LDAP Konfiguration der Administrations-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/admin/admin_ldapConfiguration.html', {})

def view_userquotas(request):
    """
    Rendert das Teil-Template für die Userkontingente der Administrations-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/admin/admin_userquotas.html', {})

def view_statistics(request):
    """
    Rendert das Teil-Template für die Statistiken der Administrations-Seite (nur Inhalt - ohne Header, Footer)
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, '../static/admin/admin_statistics.html', {})