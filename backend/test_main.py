from PIL import Image
import io
import os
import time
import numpy as np
import pickle

data_path = '/Users/mhamzaerol/Desktop/Stanford/projects/cs286-project/backend/data/all_data.pickle'

try:
    with open(data_path, 'rb') as f:
        data = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Failed to load data from {data_path}: {e}")

print(type(data))

def convert_to_pil(image):
    """
    Ensure the image is a PIL Image.
    """
    if isinstance(image, np.ndarray):
        return Image.fromarray(image)
    return image

def return_thumbnails():
    """
    Return a list of thumbnail images.
    """
    thumbnails = []
    for item in data:
        pil_image = convert_to_pil(item['image'])
        thumbnails.append(pil_image)
    return thumbnails

thumbnails = return_thumbnails()
print([np.array(thumbnail).tolist() for thumbnail in thumbnails])