import cv2
import numpy as np
import pywt
from skimage.feature import local_binary_pattern

def extract_texture_features(gray):
    # Noise residual
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    noise = gray.astype(np.float32) - blur.astype(np.float32)
    noise_var = np.var(noise)

    # LBP entropy
    lbp = local_binary_pattern(gray, 8, 1, 'uniform')
    hist, _ = np.histogram(lbp, bins=10, range=(0,10), density=True)
    lbp_entropy = -np.sum(hist * np.log(hist + 1e-8))

    # Wavelet HH energy
    coeffs = pywt.wavedec2(gray, 'haar', level=1, mode='periodization')
    _, (LH, HL, HH) = coeffs
    wavelet_energy = np.mean(np.abs(HH))

    return noise_var, lbp_entropy, wavelet_energy
