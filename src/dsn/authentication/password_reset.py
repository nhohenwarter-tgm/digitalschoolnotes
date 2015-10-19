from dsn.models import User
from mongoengine import DoesNotExist


def validate_passwordreset(email):
    try:
        User.objects.get(email=email)
        return True
    except DoesNotExist:
        return "E-Mail Adresse ist nicht korrekt."