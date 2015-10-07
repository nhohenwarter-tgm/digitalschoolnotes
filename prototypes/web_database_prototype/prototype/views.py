from prototype.models import Food
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.core.urlresolvers import reverse

def show_food(request):
    foodlist = Food.objects()
    context = {'foodlist': foodlist}
    return render(request, 'foodlist.html', context)

def insert_food(request):
    newfood = Food(name=request.POST['name'],votes=0)
    newfood.save()
    return HttpResponseRedirect(reverse('show_food'))

def vote(request, foodname, votetype):
    food = Food.objects(name=foodname).first()
    if votetype == '+':
        food.votes += 1
    else:
        food.votes -= 1
    food.save()
    return HttpResponseRedirect(reverse('show_food'))

def delete_food(request, foodname):
    food = Food.objects(name=foodname).first()
    food.delete()
    return HttpResponseRedirect(reverse('show_food'))
