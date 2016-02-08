# -*- coding: utf-8 -*-
import pytesseract
from PIL import Image
import sys

def analyseOCR(file):
    return str(pytesseract.image_to_string(Image.open(file)).encode(sys.stdout.encoding, errors='replace'))

