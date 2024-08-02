'use client';
import { ChangeEvent, useState, FormEvent } from "react";
import { Box, Button, Container, Typography } from '@mui/material';
import Layout from '../components/Layout'; 

export default function ImageScanner() {
  const [image, setImage] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");

  // Image upload logic
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      window.alert("No file selected. Choose a file.");
      return;
    }
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    }

    reader.onerror = (error) => {
      console.log("error: " + error);
    }
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (image === "") {
      alert("Upload an image.");
      return;
    }

    // POST api/analyzeImage
    await fetch("/api/analyzeImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image
      })
    })
    .then(async (response: any) => {
      const reader = response.body?.getReader();
      setOpenAIResponse("");
      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        setOpenAIResponse((prev) => prev + chunk);
      }
    })
    .catch((error) => {
      console.error('Error during analysis:', error);
    });
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
              Ask ChatGPT To Analyze Your Image
            </Button>
          </form>
          {openAIResponse && (
            <Box marginTop={4} width="100%">
              <Typography variant="h5" gutterBottom>AI Response</Typography>
              <Typography variant="body1">{openAIResponse}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
}
