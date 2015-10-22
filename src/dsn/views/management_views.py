from django.http import JsonResponse
from dsn.forms import TimeElemForm#, NotebookForm
from dsn.models import TimeTableElem, User, Notebook
from bson import ObjectId
import json


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
        form.subject = params['subject']
        form.teacher = params['teacher']
        form.begin = params['begin']
        form.end = params['end']
        form.room = params['room']
       # val = validate_registration(form.email, form.password, form.password_repeat)
        #if val is True:
        # te = TimeTableElem(gegenstand=form.gegenstand,lehrer=form.lehrer,anfang=form.anfang,ende=form.ende,raum=form.raum)#alles englisch
        te = TimeTableElem(subject=form.subject,teacher=form.teacher,begin=form.begin,end=form.end,room=form.room)
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
        params = json.loads(request.body.decode('utf-8'))
        form =NotebookForm()
        form.name = params['name']
        form.public = params['public']
        Notebook.create_notebook(name=params['name'], public=params['public'])
        return JsonResponse({'message': u'Dein Heft wurde erfolgreich erstellt!'})
