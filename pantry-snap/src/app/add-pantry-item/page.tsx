"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, Select } from '@mui/material';
import { addPantryItem } from '../services/pantryService';
import { fetchCategories } from '../services/categoryService';
import Layout from '../components/Layout';

interface Category {
  id: string;
  name: string;
}

const AddPantryItem: React.FC = () => {
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
    await addPantryItem(newItem, newQuantity, selectedCategory);
    setNewItem('');
    setNewQuantity(0);
    setSelectedCategory('');
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Pantry Item
        </Typography>
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
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as string)}
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
          <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginLeft: 8 }}>
            Add
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddPantryItem;
