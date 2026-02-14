import cv2
import numpy as np

TARGET_SIZE = 256

def standardize_image(img):
    if img is None:
        return None

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (TARGET_SIZE, TARGET_SIZE))
    return img
