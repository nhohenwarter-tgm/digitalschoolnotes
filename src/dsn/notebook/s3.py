from boto.s3.connection import S3Connection
from boto.s3.key import Key
from django.conf import settings


def saveFile(filename, filepath):
    conn = S3Connection(settings.AWS_KEY, settings.AWS_SECRET, host=settings.AWS_REGION)
    bucket = conn.get_bucket(settings.AWS_BUCKET)
    k = Key(bucket)
    k.key = filename
    k.set_contents_from_filename(filepath)
    conn.close()


def deleteFile(key):
    conn = S3Connection(settings.AWS_KEY, settings.AWS_SECRET, host=settings.AWS_REGION)
    bucket = conn.get_bucket(settings.AWS_BUCKET)
    k = Key(bucket)
    k.key= key
    k.delete()
    conn.close()


def getFileURL(key):
    conn = S3Connection(settings.AWS_KEY, settings.AWS_SECRET, host=settings.AWS_REGION)
    bucket = conn.get_bucket(settings.AWS_BUCKET)

    secure_https_url = 'https://{host}/{bucket}/{key}'.format(
    host=conn.server_name(),
    bucket=settings.AWS_BUCKET,
    key=key)

    conn.close()
    return secure_https_url

