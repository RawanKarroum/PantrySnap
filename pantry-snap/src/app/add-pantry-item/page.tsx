// src/pages/AddPantryItem.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  createTheme,
  ThemeProvider,
  MenuItem,
  Select
} from '@mui/material';
import Layout from '../components/Layout';
import { addPantryItem } from '../services/pantryService';
import { fetchCategories } from '../services/categoryService';
import { green, brown, red, grey } from '@mui/material/colors';
import { useUser } from '../context/UserContext'; 

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

interface Category {
  id: string;
  name: string;
}

const AddPantryItem: React.FC = () => {
  const [newItem, setNewItem] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { user } = useUser(); 

  useEffect(() => {
    const fetchCats = async () => {
      if (user) {
        const cats = await fetchCategories(user.uid);
        setCategories(cats);
      }
    };
    fetchCats();
  }, [user]);

  const handleAddItem = async () => {
    if (user && user.uid) {
      await addPantryItem(newItem, newQuantity, selectedCategory, user.uid);
      setNewItem('');
      setNewQuantity(0);
      setSelectedCategory('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Add Pantry Item
            </Typography>
            <Box display="flex" alignItems="center" flexDirection="column" marginTop={2}>
              <TextField
                variant="outlined"
                size="small"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                label="Add New Item"
                fullWidth
                sx={{ marginBottom: 2 }}
                InputLabelProps={{ className: 'merienda-label' }}
                InputProps={{ className: 'merienda-font' }}
              />
              <TextField
                variant="outlined"
                size="small"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value))}
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
              <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth className="merienda-font">
                Add
              </Button>
            </Box>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default AddPantryItem;
