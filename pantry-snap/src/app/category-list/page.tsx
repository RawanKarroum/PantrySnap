"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { fetchCategories, deleteCategory } from '../services/categoryService';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

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
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Category List
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem key={category.id}>
              <ListItemText primary={category.name} />
              <IconButton onClick={() => handleDeleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </Layout>
  );
};

export default CategoryList;
