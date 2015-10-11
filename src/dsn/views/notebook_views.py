from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_notebook(request):
    return render(request, 'basic/notebook.html', {})