import cv2

#cv2.imshow("Image", img)
#cv2.waitKey(0)
#cv2.destroyAllWindows()

import pytesseract
pytesseract.pytesseract.tesseract_cmd=r'C:\Program Files\Tesseract-OCR\tesseract.exe'


f = open("data_aquisition/imgTotext/sample.txt", "w")
img = cv2.imread("images/sample.jpg")
text = pytesseract.image_to_string(img)
f.write(text)
f.close()

#for i in range(1, 149):
#    f = open("imgTotext/mens" + str(i) + ".txt", "w")
#    img = cv2.imread("images/mens" + str(i) + ".jpg")
#    text = pytesseract.image_to_string(img)
#    f.write(text)
#    f.close()
