'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { fetchPantryItems } from '../services/pantryService';
import { green, brown, red, grey } from '@mui/material/colors';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';
import Layout from '../components/Layout';

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

const RecipeGenerator: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchPantryItems();
      setPantryItems(items.map(item => item.name));
    };
    fetchItems();
  }, []);

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pantryItems }),
      });
      const data = await response.json();
      // Filter out non-recipe content
      const validRecipes = data.recipes.filter(recipe => recipe.includes('**Ingredients:**') && recipe.includes('**Instructions:**'));
      setRecipes(validRecipes);
      setOpen(true);
    } catch (error) {
      console.error('Error generating recipes:', error);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrevRecipe = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : recipes.length - 1));
  };

  const handleNextRecipe = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex < recipes.length - 1 ? prevIndex + 1 : 0));
  };

  const parseRecipe = (recipe: string) => {
    if (!recipe) {
      return {
        title: 'Recipe',
        ingredients: [],
        instructions: [],
      };
    }

    const titleRegex = /Recipe \d+: (.*)/;
    const titleMatch = recipe.match(titleRegex);
    const title = titleMatch ? titleMatch[1].trim() : 'Recipe';

    const [_, ingredientsAndInstructions] = recipe.split('**Ingredients:**');
    const [ingredients, instructions] = ingredientsAndInstructions.split('**Instructions:**');

    return {
      title: title,
      ingredients: ingredients ? ingredients.trim().split('-').filter(Boolean).map(item => item.trim()) : [],
      instructions: instructions ? instructions.trim().split(/\d+\.\s+/).filter(Boolean).map(item => item.trim()) : [],
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Generate Recipes
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" marginTop={2}>
              <Button variant="contained" color="primary" onClick={generateRecipes} className="merienda-font" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Generate Recipes'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Layout>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }} className="pacifico-font">
          {parseRecipe(recipes[currentRecipeIndex]).title}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" className="merienda-font">
            Ingredients:
          </Typography>
          <ul className="merienda-font-small">
            {parseRecipe(recipes[currentRecipeIndex]).ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <Typography variant="h6" className="merienda-font">
            Instructions:
          </Typography>
          <ol className="merienda-font-small">
            {parseRecipe(recipes[currentRecipeIndex]).instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
          <IconButton onClick={handlePrevRecipe}>
            <ArrowBackIos />
          </IconButton>
          <IconButton onClick={handleNextRecipe}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
};

export default RecipeGenerator;
