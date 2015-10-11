from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_mainpage(request):
    return render(request, 'basic/main_page.html', {})