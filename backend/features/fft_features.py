import numpy as np

def radial_fft_slope(gray):
    f = np.fft.fftshift(np.fft.fft2(gray))
    power = np.abs(f) ** 2

    h, w = gray.shape
    cy, cx = h // 2, w // 2

    y, x = np.indices((h, w))
    r = np.sqrt((x - cx)**2 + (y - cy)**2).astype(int)

    radial_sum = np.bincount(r.ravel(), power.ravel())
    radial_count = np.bincount(r.ravel())
    radial_mean = radial_sum / (radial_count + 1e-8)

    if len(radial_mean) < 10:
        return -2.0

    freqs = np.arange(1, len(radial_mean))
    spectrum = radial_mean[1:]

    log_f = np.log(freqs + 1e-8)
    log_p = np.log(spectrum + 1e-8)

    try:
        slope, _ = np.polyfit(log_f, log_p, 1)
    except:
        slope = -2.0

    return slope
