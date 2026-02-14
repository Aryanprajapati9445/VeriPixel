import cv2
import numpy as np
import pywt
from skimage.feature import local_binary_pattern
from scipy.stats import entropy

def extract_features(img):
    # --- Grayscale ---
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    feats = []

    # =========================
    # 1) FFT GLOBAL ENERGY
    # =========================
    f = np.fft.fftshift(np.fft.fft2(gray))
    power = np.abs(f) ** 2
    feats.append(np.mean(power))

    # =========================
    # 2) FFT RADIAL SLOPE
    # =========================
    h, w = gray.shape
    cy, cx = h // 2, w // 2
    y, x = np.indices((h, w))
    r = np.sqrt((x - cx)**2 + (y - cy)**2).astype(int)

    radial_sum = np.bincount(r.ravel(), power.ravel())
    radial_count = np.bincount(r.ravel())
    spectrum = radial_sum / (radial_count + 1e-8)
    spectrum = spectrum[1:]

    freqs = np.arange(1, len(spectrum) + 1)
    log_f = np.log(freqs + 1e-8)
    log_p = np.log(spectrum + 1e-8)

    slope, _ = np.polyfit(log_f, log_p, 1)
    feats.append(slope)

    # =========================
    # 3–5) WAVELET ENERGIES
    # =========================
    coeffs = pywt.wavedec2(gray, "haar", level=1, mode="periodization")
    _, (LH, HL, HH) = coeffs

    feats.append(np.mean(np.abs(LH)))
    feats.append(np.mean(np.abs(HL)))
    feats.append(np.mean(np.abs(HH)))

    # =========================
    # 6–7) NOISE RESIDUAL
    # =========================
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    noise = gray.astype(np.float32) - blur.astype(np.float32)

    feats.append(np.mean(noise))
    feats.append(np.std(noise))

    # =========================
    # 8) LBP TEXTURE ENTROPY
    # =========================
    lbp = local_binary_pattern(gray, P=8, R=1, method="uniform")
    hist, _ = np.histogram(lbp, bins=10, range=(0, 10), density=True)
    feats.append(entropy(hist + 1e-8))

    # =========================
    # 9–11) HSV COLOR VARIANCE
    # =========================
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    for i in range(3):
        feats.append(np.var(hsv[:, :, i]))

    return np.array(feats, dtype=np.float32)
