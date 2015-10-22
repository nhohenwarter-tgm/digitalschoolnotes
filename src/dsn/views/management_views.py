from django.http import JsonResponse
from dsn.forms import TimeElemForm#, NotebookForm
from dsn.models import TimeTableElem, User, Notebook
from dsn.forms import NotebookForm
from bson import ObjectId
import json
from datetime import datetime


def view_timetable(request):
    """
    Stundenplan-Daten
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    print("geht")
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        print(params)
        form = TimeElemForm()
        form.gegenstand = params['gegenstand']
        form.lehrer = params['lehrer']
        form.anfang = params['anfang']
        form.ende = params['ende']
        form.raum = params['raum']
        # val = validate_registration(form.email, form.password, form.password_repeat)
        #if val is True:
        # te = TimeTableElem(gegenstand=form.gegenstand,lehrer=form.lehrer,anfang=form.anfang,ende=form.ende,raum=form.raum)#alles englisch
        te = TimeTableElem(gegenstand=form.gegenstand,lehrer=form.lehrer,anfang=form.anfang,ende=form.ende,raum=form.raum)
        print(te)
        te.save()
        return JsonResponse({'message': 'Danke fuers Eintragen'})
        # else:
        # return JsonResponse({'registration_error': val})import json

def view_getProfile(request):

    if request.method == "GET":
        #params = json.loads(request.body.decode('utf-8'))
        profile = User.objects(id=ObjectId("5624a5d7da532b17b626baa9"))

        return JsonResponse({"first_name":profile[0].first_name, "last_name":profile[0].last_name, "email":profile[0].email, "date_joined":profile[0].date_joined})


def view_createNotebook(request):
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        form = NotebookForm()
        form.name = params['name']
        form.is_public = params['is_public']
        form.create_date = datetime.now()
        form.last_change = datetime.now()
        nb = Notebook(name=form.name, is_public=form.is_public, create_date= form.create_date,last_change=form.last_change)
        nb.save()
        return JsonResponse({'message': 'Ihr Heft wurde erstellt!'})
    # else:
    # return JsonResponse({'registration_error': val})import json