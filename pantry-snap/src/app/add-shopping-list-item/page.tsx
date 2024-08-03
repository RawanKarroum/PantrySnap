'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper,
  Button,
  createTheme,
  ThemeProvider,
  Container
} from '@mui/material';
import Layout from '../components/Layout';
import { addShoppingListItem } from '../services/shoppingService';
import { fetchCategories } from '../services/categoryService';
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

interface Category {
  id: string;
  name: string;
}

const AddShoppingListItem: React.FC = () => {
  const [newItem, setNewItem] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  const handleAddItem = async () => {
    await addShoppingListItem(newItem, newQuantity, selectedCategory);
    setNewItem('');
    setNewQuantity(0);
    setSelectedCategory('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Add Shopping List Item
            </Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <Box display="flex" alignItems="center" marginTop={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  label="Add New Item"
                  fullWidth
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
                  style={{ marginLeft: 8 }}
                  fullWidth
                  InputLabelProps={{ className: 'merienda-label' }}
                  InputProps={{ className: 'merienda-font' }}
                />
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as string)}
                  displayEmpty
                  style={{ marginLeft: 8, minWidth: 120 }}
                  fullWidth
                  className="merienda-font"
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name} > 
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginLeft: 8 }} className="merienda-font">
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

export default AddShoppingListItem;
