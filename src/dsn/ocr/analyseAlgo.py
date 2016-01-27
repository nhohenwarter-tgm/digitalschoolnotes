import pytesseract
from PIL import Image


def analyseOCR(self,file):
    print(pytesseract.image_to_string(Image.open(file)))

