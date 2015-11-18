from django.http import JsonResponse
from dsn.models import User
import json
from mongoengine.queryset.visitor import Q
from dsn.authentication.email import deleteemail
from dsn.authentication.registration import create_validation_token
from dsn.authentication.account_delete import delete_account
from datetime import *

def view_users(request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
        return JsonResponse({})
    u = []
    length = 0
    weiter = False
    delete = False
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
            if user.delete_date == None:
                enddate = datetime.now() + timedelta(days=7)
                until = date(enddate.year, enddate.month, enddate.day)
                user.delete_date = until
                user.save()
                deleteemail(user.email, user.first_name, until)
            else:
                user.delete_date = None
                user.save()
        except KeyError:
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
        if user.delete_date == None:
            delete_state = 'Account löschen'
        else:
            days = abs(datetime.today().day - int(date.strftime(user.delete_date, "%d")))
            delete_state = ' Löschung in %s Tagen' % (str(days))

        u.append({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "security_level": security,
            "delete_account": delete_state
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