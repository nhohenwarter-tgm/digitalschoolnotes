from django.http import JsonResponse
from dsn.models import User
import json

def view_users(request):
    u = []
    if request.method == "GET":
        users = User.objects()
        x = 1
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
            x = x+1
    return JsonResponse({'test': u})

def view_saveUserchange(request):
    print("A")
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
            if params['security_level'] == '1':
                print("1")
                user.is_prouser = False
                user.is_superuser = False
            elif params['security_level'] == '2':
                print("2")
                user.is_prouser = True
                user.is_superuser = False
            elif params['security_level'] == '3':
                print("3")
                user.is_prouser = False
                user.is_superuser = True
            else:
                print("X")
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
