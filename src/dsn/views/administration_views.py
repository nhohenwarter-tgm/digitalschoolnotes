from django.http import JsonResponse
from dsn.models import User
import json

def view_users(request):
    u = []
    length = 0
    if request.method == "GET":
        users = User.objects[0:2]
        length = len(User.objects)
    elif request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        von = (params['Page']-1)*params['counter']
        bis = params['counter']*params['Page']
        users = User.objects[von:bis]
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
    if length == 0:
        return JsonResponse({'test': u})
    else:
        return JsonResponse({'test': u, 'len': length})

#http://docs.mongoengine.org/guide/querying.html
def view_searchUser(request):
    u = []
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        users = User.objects(email_contains=params['text'])
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
    return JsonResponse({'test': u})

def view_sortUser():
    pass


def view_saveUserchange(request):
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
            if params['security_level'] == '1':
                user.is_prouser = False
                user.is_superuser = False
            elif params['security_level'] == '2':
                user.is_prouser = True
                user.is_superuser = False
            elif params['security_level'] == '3':
                user.is_prouser = False
                user.is_superuser = True

            user.save()
        except:
            user = None
    return JsonResponse({})

def view_deleteUser(request):
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
