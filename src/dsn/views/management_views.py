from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def management(request):
    return render(request, 'basic/management.html', {})

def notebooks(request):
    return render(request, 'management/management_notebooks.html', {})

def timetable(request):
    return render(request, 'management/management_timetable.html', {})

def accsettings(request):
    return render(request, 'management/management_accsettings.html', {})