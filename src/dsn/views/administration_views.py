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
    for user in users:
        security = 1
        if user.is_prouser: security = 2
        if user.is_superuser: security = 3
        if not user.is_active: security = 4
        now = datetime.today()
        second = abs(now.second - int(date.strftime(user.last_login, "%S")))
        minute = abs(now.minute - int(date.strftime(user.last_login, "%M")))
        hour = abs(now.hour - int(date.strftime(user.last_login, "%H")))
        day = abs(now.day - int(date.strftime(user.last_login, "%d")))
        month = abs(now.month - int(date.strftime(user.last_login, "%m")))
        year = abs(now.year - int(date.strftime(user.last_login, "%Y")))
        if month >= 1 | year >= 1:
            nextmonth = (now.month % 12) + 1
            nextyear = now.year + (now.month + 1 > 12)
            until = date(nextyear, nextmonth, now.day)
            inactivemail(user.email, user.first_name, "https://digitalschoolnotes.com/login", until)
            print("send "+user.email)
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


def aa(request):
    params = json.loads(request.body.decode('utf-8'))
    try:
        user = User.objects.get(email=params['email'])
        link = create_validation_token(params['email'])
        inactivemail(params['email'], user.first_name, link, params['date'])
    except KeyError:
        pass