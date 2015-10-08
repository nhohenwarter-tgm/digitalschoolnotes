from dsn.models import Food
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def show_food(request):
    foodlist = Food.objects()
    context = {'foodlist': foodlist}
    return render(request, 'foodlist.html', context)
