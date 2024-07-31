'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { fetchPantryItems, editPantryItem, deletePantryItem } from '../services/pantryService';
import { fetchCategories } from '../services/categoryService';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  category: string; 
}

interface Category {
  id: string;
  name: string;
}

const Home: React.FC = () => {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>('');
  const [editItemQuantity, setEditItemQuantity] = useState<number>(0);
  const [editItemCategory, setEditItemCategory] = useState<string>(''); 

  // Fetch pantry items and categories
  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchPantryItems();
      setPantry(items);
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
      await editPantryItem(id, editItemName, editItemQuantity, editItemCategory); 
      setPantry(
        pantry.map((item) => (item.id === id ? { ...item, name: editItemName, quantity: editItemQuantity, category: editItemCategory } : item))
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
      await deletePantryItem(id);
      setPantry(pantry.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>Pantry Items</Typography>
        <List>
          {pantry.map((item) => (
            <ListItem key={item.id}>
              {editItemId === item.id ? (
                <Box display="flex" alignItems="center">
                  <TextField
                    variant="outlined"
                    size="small"
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    label="Edit Item"
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    value={editItemQuantity}
                    onChange={(e) => setEditItemQuantity(parseInt(e.target.value))}
                    label="Quantity"
                    style={{ marginLeft: 8 }}
                  />
                  <Select
                    value={editItemCategory}
                    onChange={(e) => setEditItemCategory(e.target.value as string)}
                    displayEmpty
                    style={{ marginLeft: 8, minWidth: 120 }}
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
                  <IconButton onClick={() => handleEditItem(item.id)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditItemId(null)}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <ListItemText primary={`${item.name} - Quantity: ${item.quantity} - Category: ${item.category}`} />
                  <Box>
                    <IconButton onClick={() => { setEditItemId(item.id); setEditItemName(item.name); setEditItemQuantity(item.quantity); setEditItemCategory(item.category); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Container>
    </Layout>
  );
};

export default Home;
