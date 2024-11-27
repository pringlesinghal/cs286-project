import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Box, Modal, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

const ImageContainer = styled(Paper)({
  width: '45vw',
  height: '45vw',
  maxWidth: '400px',
  maxHeight: '400px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '3px dashed #ccc',
  margin: '10px',
});

const getCroppedImg = (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
};

function App() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    if (image) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImage);
    }
  }, [image]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setModalOpen(true);
        setProcessedImage(null); // Reset the processed image
        setCroppedImage(null); // Reset the cropped image
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setModalOpen(false);
    // Send the cropped image to the backend for processing
    sendImageToBackend(croppedImage);
  };

  const sendImageToBackend = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'cropped_image.jpg');

      const result = await axios.post('http://localhost:8000/process_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProcessedImage(result.data.processed_image_url);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ImageContainer elevation={3}>
          {croppedImage ? (
            <img src={croppedImage} alt="Cropped" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Typography variant="h6" color="textSecondary">Cropped Image</Typography>
          )}
        </ImageContainer>
        <ImageContainer elevation={3}>
          {processedImage ? (
            <img src={processedImage} alt="Processed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Typography variant="h6" color="textSecondary">Processed Image</Typography>
          )}
        </ImageContainer>
      </Box>

      <label htmlFor="upload-button">
        <Input accept="image/*" id="upload-button" type="file" onChange={handleFileChange} />
        <Button variant="contained" component="span" sx={{ mt: 2 }}>
          Upload Image
        </Button>
      </label>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}>
          <div style={{ height: 300, position: 'relative' }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;