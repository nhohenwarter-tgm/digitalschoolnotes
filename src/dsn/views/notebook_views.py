from django.http import JsonResponse
from dsn.notebook.s3 import saveFile, deleteFile, getFileURL
from django.conf import settings
from django.core.files import File
import os

def view_savefile(request):
    saveFile("notebook_images/test.jpg", os.getcwd()+"/dsn/static/upload/test.jpg")
    return JsonResponse({'message':'?'})

def view_deletefile(request):
    deleteFile("notebook_images/test.jpg")
    return JsonResponse({'message':'?'})

def view_getfileurl(request):
    return JsonResponse({'message':getFileURL("notebook_images/test.jpg")})

def view_upload(request):
    # TODO Check if image
    # TODO Save to s3
    # TODO Verschiedene Dateiformate?!
    uploaded_file = request.FILES['file']
    file = open(os.getcwd()+"/dsn/static/upload/testupload.jpg", "wb+")
    with file as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    file.close()
    os.remove(os.getcwd()+"/dsn/static/upload/testupload.jpg")
    saveFile("notebook_images/testupload.jpg", os.getcwd()+"/dsn/static/upload/testupload.jpg")
    return JsonResponse({'message':getFileURL("notebook_images/testupload.jpg")})