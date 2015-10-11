from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def management(request):
    return render(request, 'basic/management.html', {})

def notebook(request):
    return render(request, 'management_notebook.html', {})

def timetable(request):
    return render(request, 'management_timetable.html', {})