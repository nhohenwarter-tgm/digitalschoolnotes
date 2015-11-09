from django.http import JsonResponse
from dsn.models import User
import json
from mongoengine.queryset.visitor import Q
from dsn.authentication.email import inactivemail
from dsn.authentication.registration import create_validation_token
from datetime import *

def view_users(request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
        return JsonResponse({})
    u = []
    length = 0
    weiter = False
    if request.method == "GET":
        users = User.objects[0:20]
        length = len(User.objects)
    elif request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        von = (params['Page']-1)*params['counter']
        bis = params['counter']*params['Page']

        try:
            """ Delete """
            user = User.objects.get(email=params['email'])
            user.delete()
        except KeyError:
            print("Error")
            pass

        users = User.objects()

        try:
            """ Search """
            if bool(params['text'] and params['text'].strip()):
                users = users(Q(email__icontains=params['text']) | Q(first_name__icontains=params['text']) | Q(last_name__icontains=params['text']))
        except KeyError:
            pass

        try:
            """ Sort """
            if params['order'] is not None:
                if params['order']:
                    users = users.order_by(params['spalte'])
                else:
                    users = users.order_by('-'+str(params['spalte']))
        except KeyError:
            pass
        length = len(users)
        users = users[von:bis]
    inform_delete_user(request)
    for user in users:
        security = 1
        if user.is_prouser: security = 2
        if user.is_superuser: security = 3
        if not user.is_active: security = 4
        u.append({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "security_level": security
        })
    if length == 0:
        return JsonResponse({'test': u})
    else:
        return JsonResponse({'test': u, 'len': length})


def view_saveUserchange(request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
            if params['security_level'] == '1':
                user.is_active = True
                user.is_prouser = False
                user.is_superuser = False
            elif params['security_level'] == '2':
                user.is_active = True
                user.is_prouser = True
                user.is_superuser = False
            elif params['security_level'] == '3':
                user.is_active = True
                user.is_prouser = True
                user.is_superuser = True
            elif params['security_level'] == '4':
                user.is_prouser = False
                user.is_superuser = False
                user.is_active = False

            user.save()
        except:
            user = None
    return JsonResponse({})


def inform_delete_user(request):
    try:
        until = datetime.now() - timedelta(days=90)
        users = User.objects(last_login__lte=until)
        for user in users:
            now = datetime.today()
            day = abs(now.day - int(date.strftime(user.last_login, "%d")))
            month = abs(now.month - int(date.strftime(user.last_login, "%m")))
            if month == 3:# User inform
                enddate = datetime.now()+ timedelta(days=7)
                until = date(enddate.year, enddate.month, enddate.day)
                #inactivemail(user.email, user.first_name, "https://digitalschoolnotes.com/login", until)
                print("send "+user.email)
            if month == 3 & day == 7:#User delete
                #user.delete()
                print("delete "+user.email)
    except KeyError:
        pass