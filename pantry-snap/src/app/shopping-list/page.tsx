'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Paper,
  Button,
  createTheme,
  ThemeProvider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { fetchShoppingListItems, editShoppingListItem, deleteShoppingListItem } from '../services/shoppingService';
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

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

const ShoppingList: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>('');
  const [editItemQuantity, setEditItemQuantity] = useState<number>(0);
  const [editItemCategory, setEditItemCategory] = useState<string>('');

  // Fetch shopping list items and categories
  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchShoppingListItems();
      setShoppingList(items);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  // Edit existing item
  const handleEditItem = async (id: string) => {
    try {
      await editShoppingListItem(id, editItemName, editItemQuantity, editItemCategory);
      setShoppingList(
        shoppingList.map((item) => (item.id === id ? { ...item, name: editItemName, quantity: editItemQuantity, category: editItemCategory } : item))
      );
      setEditItemId(null);
      setEditItemName('');
      setEditItemQuantity(0);
      setEditItemCategory('');
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteShoppingListItem(id);
      setShoppingList(shoppingList.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Shopping List
            </Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <List>
                {shoppingList.map((item) => (
                  <Paper elevation={3} sx={{ mb: 2, p: 2, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={item.id}>
                    {editItemId === item.id ? (
                      <Box display="flex" alignItems="center" width="100%">
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editItemName}
                          onChange={(e) => setEditItemName(e.target.value)}
                          label="Edit Item"
                          fullWidth
                        />
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          value={editItemQuantity}
                          onChange={(e) => setEditItemQuantity(parseInt(e.target.value))}
                          label="Quantity"
                          style={{ marginLeft: 8 }}
                          fullWidth
                        />
                        <Select
                          value={editItemCategory}
                          onChange={(e) => setEditItemCategory(e.target.value as string)}
                          displayEmpty
                          style={{ marginLeft: 8, minWidth: 120 }}
                          fullWidth
                        >
                          <MenuItem value="" disabled>
                            Select Category
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton onClick={() => handleEditItem(item.id)} color="primary" sx={{ marginLeft: 1 }}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => setEditItemId(null)} color="secondary" sx={{ marginLeft: 1 }}>
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                        <Box>
                          <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', fontSize: '20px' }} >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="playwrite-font">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="playwrite-font">
                            Category: {item.category}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton onClick={() => { setEditItemId(item.id); setEditItemName(item.name); setEditItemQuantity(item.quantity); setEditItemCategory(item.category); }} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
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

export default ShoppingList;
