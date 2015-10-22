from django.forms import Form, CharField, EmailField, PasswordInput, CheckboxInput, DateTimeField, BooleanField, CharField, TimeField
import datetime

class RegistrationForm(Form):

    firstname = CharField(label="Vorname", max_length=100, required=True)
    lastname = CharField(max_length=100, required=True)
    email = EmailField(required=True)
    password = PasswordInput(render_value=True)
    password_repeat = PasswordInput()
    accepted = CheckboxInput(check_test=True)


class NotebookForm(Form):

    name = CharField(label="name", max_length=30, required=True)
    is_public = BooleanField()
    create_date = DateTimeField()
    last_change = DateTimeField()


class TimeElemForm(Form):

    gegenstand = CharField(label="Gegenstand", max_length=30, required=True)
    lehrer = CharField(max_length=100, required=True)
    anfang = TimeField(required=True)
    ende = TimeField(required=True)
    raum = CharField(max_length=15, required=True)
    accepted = CheckboxInput(check_test=True)

class PasswordResetForm(Form):
    email = EmailField(required=True)
