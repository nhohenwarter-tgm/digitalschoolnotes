from django.http import JsonResponse
from dsn.forms import TimeElemForm#, NotebookForm
from dsn.models import TimeTable,TimeTableTime,TimeTableField, User, Notebook
from dsn.forms import NotebookForm
from bson import ObjectId
import json
from datetime import datetime
from mongoengine.queryset.visitor import Q
from mongoengine import DoesNotExist
from dsn.authentication.registration import create_validation_token
from dsn.authentication.email import validationmail
from django.contrib.auth import logout

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
            timetable=TimeTable.objects.get(email=email)
        except DoesNotExist:
            timetable=TimeTable()
            timetable.email = email
            timetable.times=[TimeTableTime(row=1,start="08:00",end="08:50"),
                             TimeTableTime(row=2,start="08:50",end="09:40"),
                             TimeTableTime(row=3,start="09:50",end="10:40"),
                             TimeTableTime(row=4,start="10:40",end="11:30"),
                             TimeTableTime(row=5,start="11:30",end="12:20"),
                             TimeTableTime(row=6,start="12:30",end="13:20")]
            timetable.fields=[TimeTableField(id=11,subject="",teacher="",room=""),
                              TimeTableField(id=12,subject="",teacher="",room=""),
                              TimeTableField(id=13,subject="",teacher="",room=""),
                              TimeTableField(id=14,subject="",teacher="",room=""),
                              TimeTableField(id=15,subject="",teacher="",room=""),
                              TimeTableField(id=16,subject="",teacher="",room=""),
                              TimeTableField(id=21,subject="",teacher="",room=""),
                              TimeTableField(id=22,subject="",teacher="",room=""),
                              TimeTableField(id=23,subject="",teacher="",room=""),
                              TimeTableField(id=24,subject="",teacher="",room=""),
                              TimeTableField(id=25,subject="",teacher="",room=""),
                              TimeTableField(id=26,subject="",teacher="",room=""),
                              TimeTableField(id=31,subject="",teacher="",room=""),
                              TimeTableField(id=32,subject="",teacher="",room=""),
                              TimeTableField(id=33,subject="",teacher="",room=""),
                              TimeTableField(id=34,subject="",teacher="",room=""),
                              TimeTableField(id=35,subject="",teacher="",room=""),
                              TimeTableField(id=36,subject="",teacher="",room=""),
                              TimeTableField(id=41,subject="",teacher="",room=""),
                              TimeTableField(id=42,subject="",teacher="",room=""),
                              TimeTableField(id=43,subject="",teacher="",room=""),
                              TimeTableField(id=44,subject="",teacher="",room=""),
                              TimeTableField(id=45,subject="",teacher="",room=""),
                              TimeTableField(id=46,subject="",teacher="",room=""),
                              TimeTableField(id=51,subject="",teacher="",room=""),
                              TimeTableField(id=52,subject="",teacher="",room=""),
                              TimeTableField(id=53,subject="",teacher="",room=""),
                              TimeTableField(id=54,subject="",teacher="",room=""),
                              TimeTableField(id=55,subject="",teacher="",room=""),
                              TimeTableField(id=56,subject="",teacher="",room=""),
                              TimeTableField(id=61,subject="",teacher="",room=""),
                              TimeTableField(id=62,subject="",teacher="",room=""),
                              TimeTableField(id=63,subject="",teacher="",room=""),
                              TimeTableField(id=64,subject="",teacher="",room=""),
                              TimeTableField(id=65,subject="",teacher="",room=""),
                              TimeTableField(id=66,subject="",teacher="",room="")
                              ]
            timetable.save()
        return JsonResponse({'timetable': timetable.to_json()})

def view_add_timetable(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        timetable=TimeTable.objects.get(email=request.user.email)
        fields=timetable.fields.get(id=params["fieldId"])
        fields.subject=params["subject"]
        fields.teacher=params["teacher"]
        fields.room=params["room"]
        timetable.save()
        return JsonResponse({})

def view_add_times(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        timetable=TimeTable.objects.get(email=request.user.email)
        times=timetable.times.get(row=params["rowId"])
        times.start=params["start"]
        times.end=params["end"]
        print(timetable.times)
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


def view_getUserSettings(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        user = request.user
        return JsonResponse({"first_name": user.first_name, "last_name": user.last_name,
                             "email": user.email})

def view_editUser(request):
    if not request.user.is_authenticated():
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        user = request.user
        #try und catch für email
        user.first_name=params['first_name']
        user.last_name=params['last_name']
        user.save()
        if user.email != params['email']:
            user.email=params['email']
            user.is_active=False;
            user.save()
            link = create_validation_token(params['email'])
            validationmail(params['email'], params['first_name'], link)
            logout(request)
        return JsonResponse({'message': None})