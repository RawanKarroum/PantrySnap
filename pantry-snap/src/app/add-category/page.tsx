"use client";

import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { addCategory } from '../services/categoryService';
import Layout from '../components/Layout';

const AddCategory: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>('');

  const handleAddCategory = async () => {
    await addCategory(newCategory);
    setNewCategory('');
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Category
        </Typography>
        <Box display="flex" alignItems="center" marginTop={2}>
          <TextField
            variant="outlined"
            size="small"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            label="New Category"
          />
          <Button variant="contained" color="primary" onClick={handleAddCategory} style={{ marginLeft: 8 }}>
            Add
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default AddCategory;
