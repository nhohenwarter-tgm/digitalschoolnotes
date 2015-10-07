from mongoengine import *
class Food(Document):
    name = StringField(max_length=50)
    votes = IntField(default=0)
