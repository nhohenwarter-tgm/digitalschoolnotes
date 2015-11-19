from django.http import JsonResponse
from dsn.notebook.s3 import saveFile, deleteFile, getFileURL
from django.conf import settings
import os

def view_savefile(request):
    saveFile("notebook_images/test.jpg", os.getcwd()+"/dsn/static/upload/test.jpg")
    return JsonResponse({'message':'?'})

def view_deletefile(request):
    deleteFile("notebook_images/test.jpg")
    return JsonResponse({'message':'?'})

def view_getfileurl(request):
    return JsonResponse({'message':getFileURL("notebook_images/test.jpg")})
