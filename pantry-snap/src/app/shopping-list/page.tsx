"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box, IconButton, TextField, Select, MenuItem } from '@mui/material';
import { fetchShoppingListItems, editShoppingListItem, deleteShoppingListItem } from '../services/shoppingService';
import { fetchCategories } from '../services/categoryService';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  category: string; // Add category field
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

  const handleEditItem = async (id: string) => {
    await editShoppingListItem(id, editItemName, editItemQuantity, editItemCategory); 
    setEditItemId(null);
    setEditItemName('');
    setEditItemQuantity(0);
    setEditItemCategory('');
    const items = await fetchShoppingListItems();
    setShoppingList(items);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteShoppingListItem(id);
    const items = await fetchShoppingListItems();
    setShoppingList(items);
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Shopping List
        </Typography>
        <List>
          {shoppingList.map((item) => (
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
                    <IconButton
                      onClick={() => {
                        setEditItemId(item.id);
                        setEditItemName(item.name);
                        setEditItemQuantity(item.quantity);
                        setEditItemCategory(item.category);
                      }}
                    >
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

export default ShoppingList;
