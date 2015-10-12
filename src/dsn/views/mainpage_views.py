from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def view_mainpage(request):
    """
    Rendert das Template für die Haupt-Seite
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    return render(request, 'basic/main_page.html', {})