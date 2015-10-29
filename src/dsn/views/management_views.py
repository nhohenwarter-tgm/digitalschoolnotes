from django.http import JsonResponse
from dsn.forms import TimeElemForm#, NotebookForm
from dsn.models import TimeTableElem, User, Notebook
from dsn.forms import NotebookForm
from bson import ObjectId
import json
from datetime import datetime
from mongoengine.queryset.visitor import Q


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
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(id=params['id'])
        notebooks = Notebook.objects.filter(email=user.email, is_public=True).to_json()
        return JsonResponse({"first_name": user.first_name, "last_name": user.last_name,
                             "email": user.email, "date_joined": user.date_joined, "notebooks": notebooks})


def view_createNotebook(request):
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        form = NotebookForm()
        form.name = params['name']
        form.is_public = params['is_public']
        form.create_date = datetime.now()
        form.last_change = datetime.now()
        form.email = request.user.email
        nb = Notebook(name=form.name, is_public=form.is_public, create_date= form.create_date, last_change=form.last_change, email=form.email, numpages=2)
        nb.save()
        return JsonResponse({'message': 'Ihr Heft wurde erstellt!'})
        # else:
        # return JsonResponse({'registration_error': val})import json

def view_showNotebook(request):
    if request.method == "GET":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
    return JsonResponse({"notebooks":notebooks})

def view_editNotebook(request):
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        form = NotebookForm()
        form.name = params['name']
        form.is_public = params['is_public']
        form.last_change = datetime.now()
        nb = Notebook(name=form.name, is_public=form.is_public, last_change=form.last_change)
        nb.save()
    return JsonResponse({'message': 'Ihr Heft wurde erfolgreich bearbeitet'})


def view_get_notebooks(request):
    if request.method == "POST":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
        return JsonResponse({"notebooks":notebooks})

def view_get_notebook(request):
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id']).to_json()
        return JsonResponse({"notebook":notebook})

def view_getOtherProfile(request):
    if request.method == "POST":
        profiles = []
        params = json.loads(request.body.decode('utf-8'))
        von = (params['Page']-1)*params['counter']
        bis = params['counter']*params['Page']
        try:
            if bool(params['searchtext'] and params['searchtext'].strip()):
                users = User.objects(Q(email__icontains=params['searchtext']) | Q(first_name__icontains=params['searchtext']) | Q(last_name__icontains=params['searchtext']))
                length = len(users)
                users = users[von:bis]
                for user in users:
                    profiles.append({
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "id": str(user.id),
                    })
            return JsonResponse({"profiles":profiles, 'len': length})
        except KeyError:
            return JsonResponse({"profiles":profiles, 'len': 0})
