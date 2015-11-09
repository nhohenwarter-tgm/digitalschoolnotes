from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives


def passwordresetmail(email, firstname, link):
    subject, from_email, to = 'Passwort zurücksetzen', '"DigitalSchoolNotes" <noreply@digitalschoolnotes.com>', email
    text_content = render_to_string('email/passwordreset.txt',{'firstname':firstname, 'link':link})
    html_content = render_to_string('email/passwordreset.html',{'firstname':firstname, 'link':link})
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


def validationmail(email, firstname, link):
    subject, from_email, to = u'E-Mail Adresse bestätigen', '"DigitalSchoolNotes" <noreply@digitalschoolnotes.com>', email
    text_content = render_to_string('email/validation.txt',{'firstname':firstname, 'link':link})
    html_content = render_to_string('email/validation.html',{'firstname':firstname, 'link':link})
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def inactivemail(email, firstname, link, datum):
    subject, from_email, to = 'Account löschen', '"DigitalSchoolNotes" <noreply@digitalschoolnotes.com>', email
    text_content = render_to_string('email/inactive.txt',{'firstname':firstname, 'link':link, 'datum':datum})
    html_content = render_to_string('email/inactive.html',{'firstname':firstname, 'link':link, 'datum':datum})
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()