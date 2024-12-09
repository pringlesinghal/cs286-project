// Remove the images at indices 3 and last 2 (or replace)!


import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

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
  height: '17vw',
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

const TextItemPlain = styled(Typography)({
  margin: '5px 0',
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
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [thumbnails, setThumbnails] = useState([]); 
  const [selectedDot, setSelectedDot] = useState(-1);
  const [selectedValidIndices, setSelectedValidIndices] = useState([]);
  const [validItems, setValidItems] = useState([]);
  const [invalidItems, setInvalidItems] = useState([]);

  // Fetch thumbnails from backend
  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/return_thumbnails');
        const { thumbnails } = response.data;
        setThumbnails(thumbnails.map((base64) => `data:image/png;base64,${base64}`)); // Decode Base64
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };

    fetchThumbnails();
  }, []);

  // const fetchStateData = async () => {
  //   try {
  //     console.log('Fetching state data:', selectedIdx, selectedDot, selectedValidIndices);
  //     const response = await axios.get('http://localhost:8000/return_state_data', {
  //       params: {
  //         image_index: selectedIdx,
  //         detail_level: selectedDot,
  //         object_list: selectedValidIndices,
  //       },
  //     });
  //     const { mask_overlayed_image, valid_object_color_tuples, invalid_objects } = response.data;
  //     setMainImage(`data:image/png;base64,${mask_overlayed_image}`);
  //     setValidItems(valid_object_color_tuples);
  //     setInvalidItems(invalid_objects);
  //   } catch (error) {
  //     console.error('Error fetching state data:', error);
  //   }
  // };

  const fetchStateData = async () => {
    try {
      console.log('Fetching state data:', selectedIdx, selectedDot, selectedValidIndices);
  
      // join the valid indices with commas
      const validIndicesStr = selectedValidIndices.length === 0 ? 'None' : selectedValidIndices.join(',');
      
      const response = await axios.get('http://localhost:8000/return_state_data', {
        params: {
          image_index: selectedIdx,
          detail_level: selectedDot,
          object_list: validIndicesStr,
        },
      });
      const { mask_overlayed_image, valid_object_color_tuples, invalid_objects } = response.data;
      setMainImage(`data:image/png;base64,${mask_overlayed_image}`);
      setValidItems(valid_object_color_tuples);
      setInvalidItems(invalid_objects);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };
  

  // UseEffect to fetch data after state changes
  useEffect(() => {
    if (selectedIdx !== -1 && selectedDot !== -1) {
      fetchStateData();
    }
  }, [selectedIdx, selectedDot, selectedValidIndices]);

  const handleThumbnailClick = (index) => {
    console.log('Selected image:', index);
    setSelectedIdx(index); // Updates state
    setSelectedDot(2);     // Updates state
    setSelectedValidIndices([]); // Updates state
    // fetchStateData will run automatically after state updates
  };

  const handleCloseImage = () => {
    setMainImage(null);
    setSelectedIdx(-1);
    setSelectedDot(-1);
    setSelectedValidIndices([]);
    setValidItems([]);
    setInvalidItems([]);
    // No need to fetch state data since the image is closed
  };

  const handleDotClick = (index) => {
    if (selectedIdx === -1) {
      console.log('Please select an image first');
      return;
    }
    setSelectedDot(index);
    setSelectedValidIndices([]);
    // fetchStateData will run automatically after state updates
  };

  const handleItemClick = (index) => {
    setSelectedValidIndices((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((item) => item !== index) // Remove if already selected
        : [...prevSelected, index] // Add to selected items
    );
    console.log('Toggled item:', index);
    // fetchStateData will run automatically after state updates
  };

  // const sampleTexts = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'];

  const levels = ['Coarse', 'Mid', 'Fine'];

//   const segmentationColors = [
//     "#FF0000", // Red
//     "#00FF00", // Green
//     "#0000FF", // Blue
//     "#FFFF00", // Yellow
//     "#FF00FF", // Magenta
//     "#00FFFF", // Cyan
//     "#FFA500", // Orange
//     "#800080", // Purple
//     "#FFC0CB", // Pink
//     "#32CD32", // Lime
//     "#008080", // Teal
//     "#8B4513"  // Brown
// ];

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
            Segmented
          </Typography>
          <ScrollableList>
          {validItems.map((tuple, index) => (
            <TextItem
              key={index}
              onClick={() => handleItemClick(index)}
              style={{
                color: selectedValidIndices.includes(index) ? '#1976d2' : '#000', // Change text color if selected
                borderLeft: `10px solid ${tuple[1]}`, // Add colored line
                paddingLeft: '10px', // Adjust padding to make space for the line
                // make the text bold if selected
                fontWeight: selectedValidIndices.includes(index) ? 'bold' : 'normal',
                // add margin to the left
                marginLeft: '1vw',
                marginTop: '0.75vh',
              }}
            >
              {tuple[0]}
            </TextItem>
          ))}
          </ScrollableList>
          <Typography variant="h6">
            Detected (but not Segmented)
          </Typography>
          <ScrollableList>
          {invalidItems.map((text, index) => (
            <TextItemPlain
              key={index}
              style={{
                color: '#000', // Change text color if selected
                // borderLeft: `10px solid ${segmentationColors[index % segmentationColors.length]}`, // Add colored line
                paddingLeft: '10px', // Adjust padding to make space for the line
                // make the text bold if selected
                fontWeight: 'normal',
                // add margin to the left
                marginLeft: '1vw',
                marginTop: '0.75vh',
              }}
            >
              {text}
            </TextItemPlain>
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
        {thumbnails.map((image, index) => (
          <Thumbnail
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </ImageGrid>
    </Box>
  );
};

export default App;
