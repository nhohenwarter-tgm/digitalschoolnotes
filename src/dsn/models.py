from mongoengine import *
from mongoengine.django.auth import User
from django.db import models
"""
Example:

class Food(Document):
    name = StringField(max_length=50)
    votes = IntField(default=0)
"""

"""
class Heft(Document):
    name = models.CharField(max_length=100)
    auto_creat = models.BooleanField()
    share_with = models.
    date =
    titels =
"""


#TODO Add model for notebook
#TODO Add model for timetable


class AuthUser(User):

    is_active = models.BooleanField(default=False)
    is_prouser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = () #must be list or tuple