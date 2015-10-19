from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

def passwordresetmail(email, firstname, link):
    subject, from_email, to = 'Passwort zurücksetzen', '"DigitalSchoolNotes" <noreply@digitalschoolnotes.com>', email
    text_content = render_to_string('email/passwordreset.txt',{'firstname':firstname, 'link':link})
    html_content = render_to_string('email/passwordreset.html',{'firstname':firstname, 'link':link})
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()