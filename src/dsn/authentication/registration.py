from dsn.models import AuthUser


def register_user(email, password, first_name, last_name):
    user = AuthUser.create_user(username=email, password=password, email=email)
    user.last_name = last_name
    user.first_name = first_name
    user.save()
