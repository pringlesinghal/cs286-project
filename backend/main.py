from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import os
import time
import numpy as np
import pickle
import base64
from io import BytesIO
from fastapi.responses import JSONResponse
from fastapi import Query
from typing import List
import gdown


segmentationColors = [
    (255, 0, 0),
    (0, 255, 0),
    (0, 0, 255),
    (255, 255, 0),
    (255, 0, 255),
    (0, 255, 255),
    (255, 165, 0),
    (128, 0, 128),
    (255, 192, 203),
    (50, 205, 50),
    (0, 128, 128),
    (139, 69, 19)
]

data_path = os.getenv('DATA_PATH', '/app/backend/data/all_data_up.pickle')
if not os.path.exists(data_path):
    # raise FileNotFoundError(f"The data file at {data_path} was not found.")
    url = os.getenv('DATA_URL')
    file_id = url.split('/')[-2]
    direct_link = f"https://drive.google.com/uc?id={file_id}"
    gdown.download(direct_link, data_path, quiet=False)

try:
    with open(data_path, 'rb') as f:
        data = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Failed to load data from {data_path}: {e}")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this if your frontend URL is different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def overlay_mask(base_image, mask_image, color_idx):
    """
    Given the base_image and the 0/1 mask, overlay the mask with the color indexed by the color_idx.
    """
    # Convert inputs to NumPy arrays
    overlay = np.array(base_image, dtype=np.uint8)
    mask = np.array(mask_image).astype(bool)

    if overlay.shape[:2] != mask.shape:
        raise ValueError("Base image and mask must have the same dimensions.")

    # Ensure color index is valid
    if not (0 <= color_idx < len(segmentationColors)):
        raise ValueError(f"Color index {color_idx} is out of bounds.")
    
    # Retrieve color
    color = np.array(segmentationColors[color_idx], dtype=np.uint8)
    
    # Print debugging info (optional)
    print(f'Overlay shape: {overlay.shape}')
    print(f'Mask shape: {mask.shape}')
    print(f'Color idx: {color_idx}')
    print(f'Color: {color}')
    
    # Apply color blending
    overlay[mask] = (overlay[mask] * 0.4 + color * 0.6).astype(np.uint8)
    
    # Convert back to Image
    return Image.fromarray(overlay)


def convert_to_pil(image):
    """
    Ensure the image is a PIL Image.
    """
    if isinstance(image, np.ndarray):
        return Image.fromarray(image)
    return image

async def return_thumbnails():
    """
    Return a list of thumbnail images.
    """
    thumbnails = []
    for item in data:
        pil_image = convert_to_pil(item['image'])
        thumbnails.append(pil_image)
    return thumbnails

def rgb_to_hex(rgb):
    """Convert an RGB tuple to a HEX string."""
    return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])

async def return_state_data(state):
    print(state)
    """
    Return state-specific data including overlays and object validity.
    """
    image_data = data[state['image_index']]
    base_image = convert_to_pil(image_data['image'])

    response = {
        'mask_overlayed_image': base_image,
        'valid_object_color_tuples': [],
        'invalid_objects': []
    }

    mask_data = image_data['mask_data'].get(state['detail_level'], {})
    # print(mask_data)

    for object_type, mask_info in mask_data.items():
        if mask_info['valid']:
            idx = len(response['valid_object_color_tuples'])
            if idx in state['object_list']:
                print(f"Overlaying mask for {object_type} with color {segmentationColors[idx]} as {idx} is in {state['object_list']}")
                response['mask_overlayed_image'] = overlay_mask(response['mask_overlayed_image'], mask_info['mask'], idx)
            # append the color at idx in hex
            color = segmentationColors[idx]
            response['valid_object_color_tuples'].append((object_type, rgb_to_hex(color)))
        else:
            response['invalid_objects'].append(object_type)

    buffer = BytesIO()
    response['mask_overlayed_image'].save(buffer, format="PNG")  # Save image to a buffer in PNG format
    base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")  # Encode to Base64
    response['mask_overlayed_image'] = base64_str
    return response

@app.get("/return_thumbnails")
async def return_thumbnails_endpoint():
    thumbnails = await return_thumbnails()
    encoded_images = []
    for thumbnail in thumbnails:
        buffer = BytesIO()
        thumbnail.save(buffer, format="PNG")  # Save image to a buffer in PNG format
        base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")  # Encode to Base64
        encoded_images.append(base64_str)
    return JSONResponse(content={"thumbnails": encoded_images})

@app.get("/return_state_data")
async def return_state_data_endpoint(
    image_index: int = Query(...),
    detail_level: int = Query(...),
    object_list: str = Query(...)
):
    print(object_list)
    if object_list == 'None':
        object_list = []
    else:
        object_list = [int(x) for x in object_list.split(",")]
        print(object_list)
    state = {
        "image_index": image_index,
        "detail_level": detail_level,
        "object_list": object_list,
    }
    response = await return_state_data(state)
    return response


@app.get("/")
async def root():
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)