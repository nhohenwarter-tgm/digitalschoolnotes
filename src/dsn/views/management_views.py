from django.http import JsonResponse
import json
from dsn.models import User
from dsn.models import Notebook
from dsn.forms import NotebookForm
from bson import ObjectId

def view_getProfile(request):

    if request.method == "GET":
        #params = json.loads(request.body.decode('utf-8'))
        profile = User.objects(id=ObjectId("5624a5d7da532b17b626baa9"))

        return JsonResponse({"first_name":profile[0].first_name, "last_name":profile[0].last_name, "email":profile[0].email, "date_joined":profile[0].date_joined})

def view_createNotebook(request):
        params = json.loads(request.body.decode('utf-8'))
        form =NotebookForm()
        form.name = params['name']
        form.public = params['public']
        Notebook.create_notebook(name=params['name'], public=params['public'])
        return JsonResponse({'message': u'Dein Heft wurde erfolgreich erstellt!'})