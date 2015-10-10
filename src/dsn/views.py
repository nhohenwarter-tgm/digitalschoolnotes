from dsn.models import Food
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def mainpage(request):
    return render(request, 'main_page.html', {})

def management(request):
    return render(request, 'management.html', {})

def notebook(request):
    return render(request, 'notebook.html', {})

def administration(request):
    return render(request, 'administration.html', {})