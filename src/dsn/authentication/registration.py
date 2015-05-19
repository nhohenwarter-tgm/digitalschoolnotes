from dsn.models import AuthUser


def register_user(email, password, first_name, last_name):
    user = AuthUser.create_user(username=email, password=password, email=email)
    user.last_name = last_name
    user.first_name = first_name
    user.save()

def validate_registration(email, password, password_repeat):
    if AuthUser.objects(email=email):
        return "E-Mail Adresse bereits vergeben!"
    elif password != password_repeat:
        return "Passwörter stimmen nicht überein!"
    else:
        return True