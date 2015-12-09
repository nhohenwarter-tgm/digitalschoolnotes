from dsn.models import User, PasswordReset
from mongoengine import DoesNotExist
import hashlib
from datetime import datetime, timedelta
from dsn.authentication.captcha import validate_captcha


def validate_passwordreset(email, recaptcha, ip):
    val = validate_captcha(recaptcha, ip)
    if val is True:
        try:
            user = User.objects.get(email=email)
            if 'oauth' in user:
                return "Account wurde über OAuth erstellt! Passwort kann nicht zurückgesetzt werden!"
            else:
                return True
        except DoesNotExist:
            return "E-Mail Adresse ist nicht korrekt."
    else:
        return val

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

def validate_newpassword(form, hash):
    try:
        user = User.objects.get(passwordreset__hash=hash)
        yesterday = datetime.now() - timedelta(days=1)
        if user.passwordreset.date > yesterday:
            if form.password == form.password_repeat:
                user.set_password(form.password)
                user.passwordreset = None
                user.save()
                return True
            else:
                return "Die Passwörter stimmen nicht überein.\n"
        else:
            return "Der Link ist nicht mehr gültig.\n"
    except DoesNotExist:
        return "Der Link ist nicht mehr gültig.\n"
