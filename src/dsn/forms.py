from django.forms import Form, CharField, EmailField, PasswordInput, CheckboxInput, DateTimeField, BooleanField, TimeField
import datetime

class RegistrationForm(Form):

    firstname = CharField(label="Vorname", max_length=100, required=True)
    lastname = CharField(max_length=100, required=True)
    email = EmailField(required=True)
    password = PasswordInput(render_value=True)
    password_repeat = PasswordInput()
    accepted = CheckboxInput(check_test=True)


#class NotebookForm(Form):

    #id = ObjectIdField(unique=True, required=True, primary_key=True)
    #name = StringField(max_length=30)
    #is_public = BooleanField(default=False)
    #create_date = DateTimeField(default=datetime.datetime.now())
    #last_change = DateTimeField(default=datetime.datetime.now())

    #accepted = CheckboxInput(check_test=True)

class TimeElemForm(Form):

    subject = CharField(label="Gegenstand", max_length=30, required=True)
    teacher = CharField(max_length=100, required=True)
    begin = TimeField(required=True)
    end = TimeField(required=True)
    room = CharField(max_length=15, required=True)
    accepted = CheckboxInput(check_test=True)

class PasswordResetForm(Form):
    email = EmailField(required=True)

class PasswordSetForm(Form):
    password = PasswordInput()
    password_repeat = PasswordInput()