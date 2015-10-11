from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_management(request):
    return render(request, 'basic/management.html', {})

def view_notebooks(request):
    return render(request, 'management/management_notebooks.html', {})

def view_timetable(request):
    return render(request, 'management/management_timetable.html', {})

def view_accsettings(request):
    return render(request, 'management/management_accsettings.html', {})