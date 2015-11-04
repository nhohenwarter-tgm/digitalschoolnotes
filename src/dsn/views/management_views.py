from django.http import JsonResponse
from dsn.forms import TimeElemForm#, NotebookForm
from dsn.models import TimeTableElem, User, Notebook
from dsn.forms import NotebookForm
from bson import ObjectId
import json
from datetime import datetime
from mongoengine.queryset.visitor import Q
from mongoengine import DoesNotExist


def view_timetable(request):
    """
    Stundenplan-Daten
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        print(params)
        form = TimeElemForm()
        form.subject = params['subject']
        form.teacher = params['teacher']
        form.begin = params['begin']
        form.end = params['end']
        form.room = params['room']
        te = TimeTableElem(subject=form.subject,teacher=form.teacher,begin=form.begin,end=form.end,room=form.room)
        print(te)
        te.save()
        return JsonResponse({'message': 'Danke fuers Eintragen'})


def view_getProfile(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(id=params['id'])
        notebooks = Notebook.objects.filter(email=user.email, is_public=True).to_json()
        return JsonResponse({"first_name": user.first_name, "last_name": user.last_name,
                             "is_superuser": user.is_superuser, "is_prouser": user.is_prouser,
                             "email": user.email, "date_joined": user.date_joined, "notebooks": notebooks})


def view_createNotebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        form = NotebookForm()
        try:
            Notebook.objects.get(name=params['name'], email=request.user.email)
            return JsonResponse({"message":"Name bereits vergeben!"})
        except DoesNotExist:
            pass

        form.name = params['name']
        form.is_public = params['is_public']
        form.create_date = datetime.now()
        form.last_change = datetime.now()
        form.email = request.user.email
        nb = Notebook(name=form.name, is_public=form.is_public, create_date= form.create_date, last_change=form.last_change, email=form.email, numpages=2)
        nb.save()
        return JsonResponse({'message': None})


def view_showNotebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "GET":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
    return JsonResponse({"notebooks":notebooks})


def view_editNotebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id'])
        try:
            if(notebook.name!=params['name']):
                Notebook.objects.get(name=params['name'], email=request.user.email)
                return JsonResponse({"message":"Name bereits vergeben!"})
        except DoesNotExist:
            pass
        notebook.name=params['name']
        notebook.is_public=params['is_public']
        notebook.last_change=datetime.now()
        notebook.save()
        return JsonResponse({'message': None})


def view_get_notebooks(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
        return JsonResponse({"notebooks":notebooks})


def view_get_notebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            notebook = Notebook.objects.get(id=params['id']).to_json()
        except DoesNotExist:
            return JsonResponse({"error":True})
        return JsonResponse({"notebook":notebook})


def view_getOtherProfile(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
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
            return JsonResponse({"profiles":profiles, 'len': 0})
        except KeyError:
            return JsonResponse({"profiles":profiles, 'len': 0})
