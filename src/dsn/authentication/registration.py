from dsn.models import User
from mongoengine import DoesNotExist
import datetime, hashlib
from dsn.authentication.captcha import validate_captcha


def validate_registration(email, password, password_repeat, recaptcha, ip):
    val = validate_captcha(recaptcha, ip)
    if val is True:
        try:
            User.objects.get(email=email)
            return "E-Mail Adresse bereits vergeben!"
        except DoesNotExist:
            pass
        if password != password_repeat:
            return False
        else:
            return True
    else:
        return val

def create_validation_token(email):
    user = User.objects.get(email=email)
    now = datetime.datetime.now()

    to_hash = (str(user.id) + str(now)).encode('utf-8')
    hashed = hashlib.sha256(to_hash).hexdigest()
    hashed = str(hashed)
    user.validatetoken = hashed
    user.save()
    return 'http://digitalschoolnotes.com/validate/' + hashed