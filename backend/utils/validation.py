from PIL import Image
import io

def validate_image(file_bytes):
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
        return True
    except:
        return False
