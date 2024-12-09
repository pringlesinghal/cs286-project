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

# print(type(data))

# print(data[0])

img = data[0]['mask_data'][0]['organ']['mask']
# load as a pil image
#  <PIL.Image.Image image mode=L size=1024x1024 at 0x104B92B10>
img = np.array(img).astype(bool)
print(img.max())