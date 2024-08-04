'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
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
import { fetchPantryItems, editPantryItem, deletePantryItem } from '../services/pantryService';
import { fetchCategories } from '../services/categoryService';
import { green, brown, red, grey } from '@mui/material/colors';
import { useUser } from '../context/UserContext'; // Import useUser

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
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const { user } = useUser(); 

  // Fetch pantry items
  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        const items = await fetchPantryItems(user.uid);
        setPantry(items);
      }
    };
    fetchItems();
  }, [user]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      if (user) {
        const cats = await fetchCategories(user.uid);
        setCategories(cats);
      }
    };
    fetchCats();
  }, [user]);

  // Edit existing item
  const handleEditItem = async (id: string) => {
    try {
      if (user) {
        await editPantryItem(id, editItemName, editItemQuantity, editItemCategory, user.uid);
        setPantry(
          pantry.map((item) => (item.id === id ? { ...item, name: editItemName, quantity: editItemQuantity, category: editItemCategory } : item))
        );
        setEditItemId(null);
        setEditItemName('');
        setEditItemQuantity(0);
        setEditItemCategory('');
      }
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      if (user) {
        await deletePantryItem(id, user.uid);
        setPantry(pantry.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Filter items based on search term
  const filteredItems = pantry.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Pantry Items
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search by name or category"
              fullWidth
              sx={{ marginBottom: 2 }}
              InputLabelProps={{ className: 'merienda-label' }}
              InputProps={{ className: 'merienda-font' }}
            />
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <List>
                {filteredItems.map((item) => (
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

export default Home;
