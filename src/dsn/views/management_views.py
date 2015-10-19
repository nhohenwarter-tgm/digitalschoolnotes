from django.http import JsonResponse
from dsn.forms import TimeElemForm
from dsn.models import TimeTableElem
import json


def view_timetable(request):
    """
    Stundenplan-Daten
    :param request: HTTP-Request
    :return: ein gerendertes Template
    """
    print("geht")
    if request.method == "POST":
        params = json.loads(request.body.decode('utf-8'))
        print(params)
        form = TimeElemForm()
        form.gegenstand = params['gegenstand']
        form.lehrer = params['lehrer']
        form.anfang = params['anfang']
        form.ende = params['ende']
        form.raum = params['raum']
       # val = validate_registration(form.email, form.password, form.password_repeat)
        #if val is True:
        # te = TimeTableElem(gegenstand=form.gegenstand,lehrer=form.lehrer,anfang=form.anfang,ende=form.ende,raum=form.raum)#alles englisch
        te = TimeTableElem.create(form.gegenstand,form.lehrer,form.anfang,form.ende,form.raum)
        #te.save()
        return JsonResponse({'message': 'Danke fuers Eintragen'})
       # else:
           # return JsonResponse({'registration_error': val})import json
from dsn.models import User
from bson import ObjectId

def view_getProfile(request):

    if request.method == "GET":
        #params = json.loads(request.body.decode('utf-8'))
        profile = User.objects(id=ObjectId("5624a5d7da532b17b626baa9"))

        return JsonResponse({"first_name":profile[0].first_name, "last_name":profile[0].last_name, "email":profile[0].email, "date_joined":profile[0].date_joined})
