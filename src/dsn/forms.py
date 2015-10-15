from django.forms import Form, CharField, EmailField, PasswordInput, CheckboxInput


class RegistrationForm(Form):

    firstname = CharField(label="Vorname", max_length=100, required=True)
    lastname = CharField(max_length=100, required=True)
    email = EmailField(required=True)
    password = PasswordInput(render_value=True)
    password_repeat = PasswordInput()
    accepted = CheckboxInput(check_test=True)