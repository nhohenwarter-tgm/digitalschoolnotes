from django.core.management import BaseCommand
from datetime import *
from dsn.models import User
from dsn.authentication.email import inactivemail
from dsn.authentication.account_delete import delete_account


#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Command for the User notification"

    # A command must define handle()
    def handle(self, *args, **options):
        until = datetime.now() - timedelta(days=90)
        users = User.objects(last_login__lte=until)
        for user in users:
            now = datetime.today()
            day = abs(now.day - int(date.strftime(user.last_login, "%d")))
            month = abs(now.month - int(date.strftime(user.last_login, "%m")))
            if month == 3 and day == 0:# User inform
                enddate = datetime.now()+ timedelta(days=7)
                until = date(enddate.year, enddate.month, enddate.day)
                inactivemail(user.email, user.first_name, "https://digitalschoolnotes.com/login", until)
                #print("send "+user.email)
            if month == 3 and day == 7:#User delete
                delete_account(user)