from dsn.models import TimeTable, Notebook


def delete_account(user):
    try:
        Notebook.objects.filter(email=user.email).delete()
    except:
        pass
    try:
        TimeTable.objects.get(email=user.email).delete()
    except:
        pass
    user.delete()
    return True