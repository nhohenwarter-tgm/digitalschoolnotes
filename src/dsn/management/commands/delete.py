from django.core.management import BaseCommand
from datetime import *
from dsn.models import User
from dsn.authentication.account_delete import delete_account

#https://docs.djangoproject.com/en/1.9/howto/custom-management-commands/
#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Command for the User notification"

    # A command must define handle()
    def handle(self, *args, **options):
        until = datetime.now() + timedelta(days=7)
        users = User.objects(delete_date__lte=until)
        for user in users:
            now = datetime.today()
            day = abs(now.day - int(date.strftime(user.delete_date, "%d")))
            if day == 0:#User delete
                delete_account(user)