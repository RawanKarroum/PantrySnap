'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  IconButton,
  Paper,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { fetchCategories, deleteCategory } from '../services/categoryService';
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

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchCategories();
      setCategories(items);
    };
    fetchItems();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    const items = await fetchCategories();
    setCategories(items);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Category List
            </Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <List>
                {categories.map((category) => (
                  <Paper elevation={3} sx={{ mb: 2, p: 2, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={category.id}>
                    <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', fontSize: '20px' }} className="playwrite-font">
                      {category.name}
                    </Typography>
                    <IconButton onClick={() => handleDeleteCategory(category.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default CategoryList;
