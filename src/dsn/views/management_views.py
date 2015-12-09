from django.http import JsonResponse
from dsn.models import TimeTable, TimeTableTime, TimeTableField, User, Notebook, NotebookContent
from dsn.forms import NotebookForm
from dsn.authentication.account_delete import delete_account

from bson import ObjectId
import json
from datetime import datetime
from mongoengine.queryset.visitor import Q
from mongoengine import DoesNotExist, InvalidDocumentError
from django.contrib.auth import logout
from dsn.authentication.registration import create_validation_token
from dsn.authentication.email import validationmail
from django.contrib.auth.hashers import *


def view_get_timetable(request):
    """
    Stundenplan-Daten
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        email = request.user.email
        try:
            timetable = TimeTable.objects.get(email=email)
        except DoesNotExist:
            timetable = TimeTable()
            timetable.email = email

            timetable.times = []
            for x in range(1, 11):
                timetable.times.append(TimeTableTime(row=x, start="00:00", end="00:00"))

            timetable.fields = []
            for x in range(1, 11):
                for z in range(1, 7):
                    timetable.fields.append(
                        TimeTableField(id=(x * 10 + z), subject="", teacher="", room="", notebook=""))

            timetable.save()
        return JsonResponse({'timetable': timetable.to_json()})


def view_add_timetable(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        timetable = TimeTable.objects.get(email=request.user.email)
        fields = timetable.fields.get(id=params["fieldId"])
        fields.subject = params["subject"]
        fields.teacher = params["teacher"]
        fields.room = params["room"]
        fields.notebook = params["notebook"]
        timetable.save()
        return JsonResponse({})


def view_add_times(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        timetable = TimeTable.objects.get(email=request.user.email)
        times = timetable.times.get(row=params["rowId"])
        times.start = params["start"]
        times.end = params["end"]
        timetable.save()
        return JsonResponse({})


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

        notebooks = Notebook.objects.filter(email=request.user.email).count()

        if request.user.is_prouser:
            if notebooks >= 20: #TODO Maximale Heftanzahl festlegen
                return JsonResponse({'message': 'Maximale Anzahl an Heften bereits erreicht!'})
        else:
            if notebooks >= 10:
                return JsonResponse({'message': 'Maximale Anzahl an Heften bereits erreicht!'})

        form = NotebookForm()
        try:
            Notebook.objects.get(name=params['name'], email=request.user.email)
            return JsonResponse({"message": "Name bereits vergeben!"})
        except DoesNotExist:
            pass

        form.name = params['name']
        form.is_public = params['is_public']
        form.create_date = datetime.now()
        form.last_change = datetime.now()
        form.email = request.user.email
        nb = Notebook(name=form.name, is_public=form.is_public, create_date=form.create_date,
                      last_change=form.last_change, email=form.email, numpages=6)
        nb.save()
        return JsonResponse({'message': None})


def view_showNotebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "GET":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
    return JsonResponse({"notebooks": notebooks})


def view_editNotebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id'])
        try:
            if (notebook.name != params['name']):
                Notebook.objects.get(name=params['name'], email=request.user.email)
                return JsonResponse({"message": "Name bereits vergeben!"})
        except DoesNotExist:
            pass
        notebook.name = params['name']
        notebook.is_public = params['is_public']
        notebook.last_change = datetime.now()
        notebook.save()
        return JsonResponse({'message': None})


def view_edit_notebooklength(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id'])
        notebook.numpages = notebook.numpages + 1
        notebook.save()
        notebooks = Notebook.objects.get(id=params['id']).to_json()
        return JsonResponse({"notebook": notebooks})

def view_get_notebooks(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        notebooks = Notebook.objects.filter(email=request.user.email).to_json()
        return JsonResponse({"notebooks": notebooks})


def view_add_notebook_content(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            notebook = Notebook.objects.get(id=params['id'])
            if len(notebook.content) == 0:
                id = 1
            else:
                id = notebook.content[0].id + 1
        except NoneType:
            id = 1
        notebook.content.append(NotebookContent(id=id, art=params['content_art'], position_x = 1, position_y = 1, position_site = params['content_site'],  data = "E"))
        notebook.save()
        notebook = Notebook.objects.get(id=params['id']).to_json()
        return JsonResponse({"notebook": notebook})


def view_delete_notebook_content(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id'])
        content = notebook.content
        # del([i for i,_ in enumerate(content) if _['id'] == params['content_id'] and _["art"] == params['content_art']][0])
        content.remove(next(item for item in content if item["id"] == params['content_id'] and item["art"] == params['content_art']))
        notebook.save()
        notebook = Notebook.objects.get(id=params['id']).to_json()
        return JsonResponse({"notebook": notebook})


# GEHT NICHT
def view_edit_notebook_content(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        notebook = Notebook.objects.get(id=params['id'])
        content = notebook.content
        findnotebook = next(item for item in content if item["id"] == params['content_id'] and item["art"] == params['content_art'])
        findnotebook.data = params['content_data']
        notebook.save()
        notebook = Notebook.objects.get(id=params['id']).to_json()
        return JsonResponse({"notebook": notebook})

def view_get_notebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        if 'id' in params:
            try:
                notebook = Notebook.objects.get(id=params['id']).to_json()
            except:
                return JsonResponse({"error": True})
        elif 'name' in params:
            try:
                notebook = Notebook.objects.get(name=params['name']).to_json()
            except:
                return JsonResponse({"error": True})
        else:
            return JsonResponse({"notebook": None})
        return JsonResponse({"notebook": notebook})


def view_getOtherProfile(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        profiles = []
        params = json.loads(request.body.decode('utf-8'))
        von = (params['Page'] - 1) * params['counter']
        bis = params['counter'] * params['Page']
        try:
            if bool(params['searchtext'] and params['searchtext'].strip()):
                users = User.objects(
                    Q(email__icontains=params['searchtext']) | Q(first_name__icontains=params['searchtext']) | Q(
                        last_name__icontains=params['searchtext']))
                length = len(users)
                users = users[von:bis]
                for user in users:
                    profiles.append({
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "id": str(user.id),
                    })
                return JsonResponse({"profiles": profiles, 'len': length})
            return JsonResponse({"profiles": profiles, 'len': 0})
        except KeyError:
            return JsonResponse({"profiles": profiles, 'len': 0})


def view_getUserSettings(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        user = request.user
        return JsonResponse({"first_name": user.first_name, "last_name": user.last_name,
                             "email": user.email, "password": user.password})


def view_editUser(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        user = request.user
        user.first_name=params['first_name']
        user.last_name=params['last_name']
        if params['password']!= "":
            if user.check_password(params['password_old']) == True:
                user.set_password(params['password'])
            else:
                return JsonResponse({'message': "Das alte Passwort wiederholen"})
        user.first_name = params['first_name']
        user.last_name = params['last_name']
        if user.check_password(params['password_old']) == True:
            user.set_password(params['password'])
        else:
            return JsonResponse({'message': "Das alte Passwort wiederholen"})
        user.save()
        if user.email != params['email']:
            user.email = params['email']
            user.is_active = False;
            user.save()
            link = create_validation_token(params['email'])
            validationmail(params['email'], params['first_name'], link)
            logout(request)
        return JsonResponse({'message': None})


def view_delete_notebook(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            notebook = Notebook.objects.get(id=params['id'])
            tt = TimeTable.objects.get(email=request.user.email)
            fields = tt.fields.filter(notebook=notebook.name)
            for f in fields:
                f.notebook = ""
            tt.save()
            notebook.delete()
            return JsonResponse({})
        except DoesNotExist:
            return JsonResponse({"error": True})


def view_delete_account(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        user = request.user
        logout(request)
        delete_account(user)
        return JsonResponse({})
