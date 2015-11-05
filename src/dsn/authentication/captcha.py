from django.conf import settings
import requests

def validate_captcha(recaptcha, ip):
    response = {}
    url = "https://www.google.com/recaptcha/api/siteverify"

    params = {
        'secret': settings.RECAPTCHA_SECRET_KEY, # echter key
        #'secret':'6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', #Testing
        'response': recaptcha,
        'remoteip': ip
    }

    verify = requests.get(url, params=params, verify=True)
    verify = verify.json()

    response["status"] = verify.get("success", False)

    if response["status"] == True:
        return True
    else:
        return "Captcha ist nicht valide."