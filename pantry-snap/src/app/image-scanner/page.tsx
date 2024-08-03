'use client';

import { ChangeEvent, useState, FormEvent } from "react";
import { Box, Button, Container, Typography } from '@mui/material';
import Layout from '../components/Layout'; 
import { storage } from '../config/Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ImageScanner() {
  const [image, setImage] = useState<File | null>(null);
  const [objects, setObjects] = useState<Array<{ name: string, confidence: number }>>([]);

  // Handle image file change
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image) {
      alert("Upload an image.");
      return;
    }

    try {
      // Upload the image to Firebase
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      console.log("Image URL:", imageUrl);

      // Call the classifyImage API
      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      setObjects(data);
    } catch (error) {
      console.error('Error during image classification:', error);
    }
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>Image Scanner</Typography>
        <Box display="flex" flexDirection="column" alignItems="center" marginTop={2}>
          <form onSubmit={handleSubmit}>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {image && <Typography variant="body1" marginTop={2}>Image selected</Typography>}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: 2 }}
            >
              Classify Image
            </Button>
          </form>
          {objects.length > 0 && (
            <Box marginTop={4} width="100%">
              <Typography variant="h5" gutterBottom>AI Response</Typography>
              {objects.map((object, index) => (
                <div key={index}>
                  <Typography variant="body1">Name: {object.name}</Typography>
                  <Typography variant="body1">Confidence: {(object.confidence * 100).toFixed(2)}%</Typography>
                </div>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
}
