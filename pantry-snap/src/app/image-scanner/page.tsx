'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  ThemeProvider,
  IconButton,
  Typography,
} from '@mui/material';
import { Camera } from "react-camera-pro";
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import Layout from '../components/Layout'; 
import { storage } from '../config/Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fetchCategories } from '../services/categoryService';
import { addPantryItem } from '../services/pantryService';
import { green, brown, red, grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: brown[500],
    },
    error: {
      main: red[500],
    },
    background: {
      default: 'transparent',
    },
    text: {
      primary: grey[900],
      secondary: grey[600],
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 18,
    allVariants: {
      textTransform: 'capitalize',
    },
  },
});

const ImageScanner: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [cameraImage, setCameraImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [objects, setObjects] = useState<Array<{ name: string }>>([]);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const camera = useRef<any>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: string, name: string }>>([]);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      setCameraImage(null);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  const handleSubmit = async () => {
    if (!image && !cameraImage) {
      alert("Upload an image or take a photo.");
      return;
    }

    try {
      let uploadedImageUrl = '';

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        uploadedImageUrl = await getDownloadURL(imageRef);
      } else if (cameraImage) {
        const imageBlob = await fetch(cameraImage).then(res => res.blob());
        const imageRef = ref(storage, `images/camera_${new Date().getTime()}.jpg`);
        await uploadBytes(imageRef, imageBlob);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      console.log("Image URL:", uploadedImageUrl);

      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageUrl: uploadedImageUrl })
      });

      const data = await response.json();
      setObjects(data.map((obj: { name: string }) => ({ name: obj.name })));
      setIsResultModalOpen(true);
    } catch (error) {
      console.error('Error during image classification:', error);
    }
  }

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    setCameraImage(photo);
    setImage(null);
    setImageUrl(photo);
    handleCloseCamera();
  };

  const handleConfirmImage = async () => {
    await handleSubmit();
  };

  const handleCancelImage = () => {
    setImage(null);
    setCameraImage(null);
    setImageUrl(null);
  };

  const handleSave = async () => {
    const itemName = objects[0]?.name;
    if (itemName && quantity > 0 && selectedCategory) {
      try {
        await addPantryItem(itemName, quantity, selectedCategory);
        console.log('Item added to pantry:', { name: itemName, quantity, category: selectedCategory });
      } catch (error) {
        console.error('Error adding item to pantry:', error);
      }
    } else {
      alert("Please provide valid quantity and category.");
    }
    setIsResultModalOpen(false);
    handleCancelImage();
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Image Scanner
            </Typography>
            <Box display="flex" alignItems="center" flexDirection="column" marginTop={2}>
              {!imageUrl && (
                <form style={{ width: '100%' }}>
                  <Button variant="contained" component="label" fullWidth className="merienda-font" sx={{ marginBottom: 2 }}>
                    Choose File
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleOpenCamera} fullWidth className="merienda-font" sx={{ marginBottom: 2 }}>
                    Open Camera
                  </Button>
                </form>
              )}
              {imageUrl && (
                <>
                  <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '16px' }} />
                  <Box display="flex" justifyContent="space-around" width="100%">
                    <IconButton onClick={handleConfirmImage} color="primary">
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelImage} color="error">
                      <ClearIcon />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>

            <Dialog open={isCameraOpen} onClose={handleCloseCamera} maxWidth="sm" fullWidth>
              <DialogTitle className="merienda-font">Take a Photo</DialogTitle>
              <DialogContent>
                <Camera 
                  ref={camera} 
                  aspectRatio={16 / 9} 
                  errorMessages={{
                    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                    switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                    canvas: 'Canvas is not supported.',
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleTakePhoto} color="primary" className="merienda-font">
                  Take Photo
                </Button>
                <Button onClick={handleCloseCamera} color="secondary" className="merienda-font">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle className="merienda-font">{objects[0]?.name}</DialogTitle>
              <DialogContent>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  label="Quantity"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{ className: 'merienda-label' }}
                  InputProps={{ className: 'merienda-font' }}
                />
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as string)}
                  displayEmpty
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  className="merienda-font"
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name} className="merienda-font">
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSave} color="primary" className="merienda-font">
                  Save
                </Button>
                <Button onClick={() => setIsResultModalOpen(false)} color="secondary" className="merienda-font">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ImageScanner;
