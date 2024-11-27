from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
import io
import os
import time

app = FastAPI()

# Create directories if they don't exist
os.makedirs("processed_images", exist_ok=True)

# Mount the static directory for processed images
app.mount("/processed_images", StaticFiles(directory="processed_images"), name="processed_images")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this if your frontend URL is different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_image")
async def process_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Process the image here
    # For example, let's just create a grayscale version
    processed_image = image.convert('L')
    
    # Generate a unique filename using a timestamp
    timestamp = int(time.time() * 1000)
    filename = f"processed_image_{timestamp}.jpg"
    processed_image_path = f"processed_images/{filename}"
    
    # Save the processed image
    processed_image.save(processed_image_path)
    
    # Return the URL of the processed image
    return {"processed_image_url": f"http://localhost:8000/processed_images/{filename}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)