from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_administration(request):
    return render(request, 'basic/administration.html', {})

def view_usermanagement(request):
    return render(request, 'administration/admin_usermanagement.html', {})

def view_bills(request):
    return render(request, 'administration/admin_bills.html', {})

def view_ldap_configuration(request):
    return render(request, 'administration/admin_ldapConfiguration.html', {})

def view_userquotas(request):
    return render(request, 'administration/admin_userquotas.html', {})

def view_statistics(request):
    return render(request, 'administration/admin_statistics.html', {})