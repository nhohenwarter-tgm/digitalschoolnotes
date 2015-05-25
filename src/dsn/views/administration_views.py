from django.http import JsonResponse
from dsn.models import User
import json

def view_users(request):
    u = {}
    if request.method == "GET":
        users = User.objects()
        x = 1
        for user in users:
            u["user"+str(x)] = {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "security_level": 3,
                "storage": 1000,
                "bill": 'xy'
            }
            x = x+1
    return JsonResponse(u)

def view_deleteUser(request):
    print("A")
    try:
        user = User.objects.get(email=params['email'])
    except:
        print("B")
    if request.method == "POST":
        print("B")
        params = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=params['email'])
        except:
            user = None
        user.delete()
        return JsonResponse({})
    else:
        return JsonResponse({})
