# -*- coding: utf-8 -*-
import pytesseract
from PIL import Image
import sys

def analyseOCR(file):
    s = str(pytesseract.image_to_string(Image.open(file)).encode(sys.stdout.encoding, errors='replace'))
    s = s[2:-1]
    s = s.replace("\\n", "<br />").replace("\\x", "")
    if s == "":
        s="Es ist ein Fehler aufgetreten!"
    return s
