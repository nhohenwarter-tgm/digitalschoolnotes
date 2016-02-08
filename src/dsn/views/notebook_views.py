from django.http import JsonResponse
from dsn.notebook.s3 import saveFile, deleteFile, getFileURL
from django.conf import settings
from django.core.files import File
from uuid import uuid4
import os
import json
from PIL import Image
from dsn.ocr.analyseAlgo import analyseOCR

def view_savefile(request):
    saveFile("notebook_images/test.jpg", os.getcwd()+"/dsn/static/upload/test.jpg")
    return JsonResponse({'message':'?'})

def view_deletefile(request):
    params = json.loads(request.body.decode('utf-8'))
    #TODO Philipp: Richtige Löschung des Files (Import in andere Hefte beachten! Link mehrfach vorhanden?)
    deleteFile(params['file'].split('digitalschoolnotes/')[1])
    return JsonResponse({'message':'?'})

def view_getfileurl(request):
    return JsonResponse({'message':getFileURL("notebook_images/test.jpg")})

def view_upload(request):
    # TODO Check if image
    # TODO Save to s3
    # TODO Verschiedene Dateiformate?!
    uploaded_file = request.FILES['file']
    typ = str(uploaded_file).split('.')[len(str(uploaded_file).split('.'))-1]
    filename = str(uuid4())
    file = open(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ, "wb+")
    with file as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    image = Image.open(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ)
    image.save(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ, typ.upper(), quality = 85, optimize = True)
    image.close()
    saveFile("notebook_images/"+filename+"."+typ, os.getcwd()+"/dsn/static/upload/"+filename+"."+typ)
    os.remove(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ)
    return JsonResponse({'message':getFileURL("notebook_images/"+filename+"."+typ)})

def view_analyseOCR(request):
    # TODO Check if image
    # TODO Verschiedene Dateiformate?!
    uploaded_file = request.FILES['file']
    typ = str(uploaded_file).split('.')[len(str(uploaded_file).split('.'))-1]
    filename = str(uuid4())
    file = open(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ, "wb+")
    with file as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    file.close()
    ocrtext=analyseOCR(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ)
    os.remove(os.getcwd()+"/dsn/static/upload/"+filename+"."+typ)
    print(ocrtext)
    return JsonResponse({'ocrt': ocrtext})
