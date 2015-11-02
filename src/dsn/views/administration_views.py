from django.http import JsonResponse
from dsn.models import User
import json
from mongoengine.queryset.visitor import Q


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
            if bool(params['text'] and params['text'].strip()):
                users = User.objects(Q(email__icontains=params['text']) | Q(first_name__icontains=params['text']) | Q(last_name__icontains=params['text']))
            else:
                weiter = True
                users = User.objects()
        except KeyError:
            weiter = True
            users = User.objects()

        if weiter:
            try:
                if params['order'] is not None:
                    if params['order']:
                        users = User.objects().order_by(params['spalte'])
                    else:
                        users = User.objects().order_by('-'+str(params['spalte']))
            except KeyError:
                users = User.objects()

        length = len(users)
        users = users[von:bis]
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


def view_sortUser(request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
        return JsonResponse({})
    u = []
    length = 0
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        print(params['order'])
        if params['order']:
            users = User.objects().order_by(params['spalte'])
        else:
            users = User.objects().order_by('-'+str(params['spalte']))
        length = len(users)
        von = (params['Page']-1)*params['counter']
        bis = params['counter']*params['Page']
        users = users[von:bis]
        for user in users:
            security = 1
            if user.is_prouser: security = 2
            if user.is_superuser: security = 3
            u.append({
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "security_level": security
            })
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
                user.is_prouser = False
                user.is_superuser = True
            elif params['security_level'] == '4':
                user.is_prouser = False
                user.is_superuser = False
                user.is_active = False

            user.save()
        except:
            user = None
    return JsonResponse({})


def view_deleteUser(request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
        return JsonResponse({})
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
            user.delete()
        except:
            user = None
        return JsonResponse({})
    else:
        return JsonResponse({})
