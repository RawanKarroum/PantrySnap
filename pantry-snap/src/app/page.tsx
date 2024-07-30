'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Layout from '../app/components/Layout';
import { fetchPantryItems, addPantryItem, editPantryItem, deletePantryItem } from '../app/services/pantryService';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
}

const Home: React.FC = () => {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>('');
  const [editItemQuantity, setEditItemQuantity] = useState<number>(0);

  // Fetch pantry items
  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchPantryItems();
      setPantry(items);
    };
    fetchItems();
  }, []);

  // Add new item
  const handleAddItem = async () => {
    try {
      await addPantryItem(newItem, newQuantity);
      setPantry([...pantry, { id: newItem, name: newItem, quantity: newQuantity }]);
      setNewItem('');
      setNewQuantity(0);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Edit existing item
  const handleEditItem = async (id: string) => {
    try {
      await editPantryItem(id, editItemName, editItemQuantity);
      setPantry(
        pantry.map((item) => (item.id === id ? { ...item, name: editItemName, quantity: editItemQuantity } : item))
      );
      setEditItemId(null);
      setEditItemName('');
      setEditItemQuantity(0);
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
                  <IconButton onClick={() => handleEditItem(item.id)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditItemId(null)}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <ListItemText primary={`${item.name} - Quantity: ${item.quantity}`} />
                  <Box>
                    <IconButton onClick={() => { setEditItemId(item.id); setEditItemName(item.name); setEditItemQuantity(item.quantity); }}>
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
        <Box display="flex" alignItems="center" marginTop={2}>
          <TextField
            variant="outlined"
            size="small"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            label="Add New Item"
          />
          <TextField
            variant="outlined"
            size="small"
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            label="Quantity"
            style={{ marginLeft: 8 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginLeft: 8 }}>
            Add
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;
