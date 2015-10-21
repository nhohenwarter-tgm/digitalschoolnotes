from dsn.models import User
from mongoengine import DoesNotExist
import hashlib
from datetime import datetime, timedelta


def validate_passwordreset(email):
    try:
        User.objects.get(email=email)
        return True
    except DoesNotExist:
        return "E-Mail Adresse ist nicht korrekt."

def create_passwordreset_token(email):
    user = User.objects.get(email=email)
    datenow = datetime.now
    to_hash = (str(user.id) + str(datenow)).encode('utf-8')
    hashed = hashlib.sha256(to_hash).hexdigest()
    user.passwordreset = {'hash':hashed, 'datetime':datenow}
    user.save()
    return hashed