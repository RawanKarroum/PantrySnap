'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  createTheme,
  ThemeProvider
} from '@mui/material';
import Layout from '../components/Layout';
import { addCategory } from '../services/categoryService';
import { green, brown, red, grey } from '@mui/material/colors';

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

const AddCategory: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>('');

  const handleAddCategory = async () => {
    await addCategory(newCategory);
    setNewCategory('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Add Category
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" width="100%" maxWidth="500px">
                <TextField
                  variant="outlined"
                  size="small"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  label="New Category"
                  fullWidth
                  InputLabelProps={{ className: 'merienda-label' }}
                  InputProps={{ className: 'merienda-font' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ marginLeft: 2 }} className="merienda-font">
                  Add
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default AddCategory;
