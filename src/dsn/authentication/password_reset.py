from dsn.models import User, PasswordReset
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
    now = datetime.now()

    to_hash = (str(user.id) + str(now)).encode('utf-8')
    hashed = hashlib.sha256(to_hash).hexdigest()
    hashed = str(hashed)
    reset = PasswordReset(hash=hashed, date=now)
    user.passwordreset = reset
    user.save()
    return 'http://digitalschoolnotes.com/resetpassword/' + hashed