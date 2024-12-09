import React, { useState } from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';

const ImageContainer = styled(Paper)({
  width: '40vw',
  height: '40vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  border: '3px dashed #ccc',
  margin: '10px',
});

const ScrollableList = styled('div')({
  width: '20vw',
  height: '38vw',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'center',
  border: '2px solid #ccc',
  margin: '10px',
});

const TextItem = styled(Typography)({
  margin: '5px 0',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#1976d2',
  },
});

const DotContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Center vertically
  // alignItems: 'center', // Center horizontally
  margin: '0 10px',
  // height: '100%', // Ensure it takes up the full height of the parent container
  height: '40vw',
});


const DotWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  margin: '10px 0',
});

const Dot = styled('div')(({ selected }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: selected ? '#1976d2' : '#ccc',
  marginRight: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}));

const LevelLabel = styled(Typography)({
  fontSize: '14px',
  color: '#666',
  fontWeight: '500',
});

const ImageGrid = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginTop: '20px',
  width: '80vw',
  overflowX: 'scroll',
  whiteSpace: 'nowrap',
});

const Thumbnail = styled('img')({
  width: '10vw',
  height: '10vw',
  margin: '5px',
  cursor: 'pointer',
  objectFit: 'cover',
  border: '2px solid transparent',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: '#1976d2',
  },
});

const CloseButton = styled('div')({
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  backgroundColor: '#f5f5f5',
  borderRadius: '50%',
  padding: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const App = () => {
  const [mainImage, setMainImage] = useState(null);
  const [selectedDot, setSelectedDot] = useState(-1);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items
  const [itemList, setItemList] = useState([]); // Track selected items

  const getRandomItemList = () => {
    const shuffled = sampleTexts.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, Math.floor(Math.random() * shuffled.length));
    return selected;
  }

  const handleThumbnailClick = (image) => {
    setMainImage(image);
    setSelectedItems([]);
    setSelectedDot(2);
    setItemList(getRandomItemList());
    console.log('Selected image:', image);
  };

  const handleDotClick = (index) => {
    // check if an image is selected
    if (!mainImage) {
      console.log('Please select an image first');
      return;
    }
    setSelectedItems([]);
    setSelectedDot(index);
    setItemList(getRandomItemList());
    console.log('Selected dot:', index);
  };

  const handleItemClick = (index) => {
    // check if an image is selected
    if (!mainImage) {
      console.log('Please select an image first');
      return;
    }
    setSelectedItems((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((item) => item !== index) // Remove if already selected
        : [...prevSelected, index] // Add to selected items
    );
    console.log('Toggled item:', index);
  };

  const handleCloseImage = () => {
    setSelectedDot(-1);
    setSelectedItems([]);
    setMainImage(null);
    setItemList([]);
    console.log('Closed main image');
  };

  const sampleImages = [
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/101',
    'https://via.placeholder.com/102',
    'https://via.placeholder.com/103',
    'https://via.placeholder.com/104',
    'https://via.placeholder.com/105',
    'https://via.placeholder.com/106',
    'https://via.placeholder.com/107',
    'https://via.placeholder.com/108',
    'https://via.placeholder.com/109',
  ];

  const sampleTexts = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'];

  const levels = ['Coarse', 'Mid', 'Fine'];

  const segmentationColors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#32CD32", // Lime
    "#008080", // Teal
    "#8B4513"  // Brown
];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ImageContainer>
          {mainImage ? (
            <>
              <img src={mainImage} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <CloseButton onClick={handleCloseImage}>X</CloseButton>
            </>
          ) : (
            <Typography variant="h6" color="textSecondary">Please Select an Image Below</Typography>
          )}
        </ImageContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6">
            Object Types
          </Typography>
          <ScrollableList>
          {itemList.map((text, index) => (
            <TextItem
              key={index}
              onClick={() => handleItemClick(index)}
              style={{
                color: selectedItems.includes(index) ? '#1976d2' : '#000', // Change text color if selected
                borderLeft: `10px solid ${segmentationColors[index % segmentationColors.length]}`, // Add colored line
                paddingLeft: '10px', // Adjust padding to make space for the line
                // make the text bold if selected
                fontWeight: selectedItems.includes(index) ? 'bold' : 'normal',
                // add margin to the left
                marginLeft: '1vw',
                marginTop: '0.75vh',
              }}
            >
              {text}
            </TextItem>
          ))}
          </ScrollableList>
        </Box>


        <DotContainer>
          {levels.map((label, index) => (
            <DotWrapper key={index}>
              <Dot
                selected={selectedDot === index}
                onClick={() => handleDotClick(index)}
              />
              <LevelLabel>{label}</LevelLabel>
            </DotWrapper>
          ))}
        </DotContainer>
      </Box>

      <ImageGrid>
        {sampleImages.map((image, index) => (
          <Thumbnail
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(image)}
          />
        ))}
      </ImageGrid>
    </Box>
  );
};

export default App;
