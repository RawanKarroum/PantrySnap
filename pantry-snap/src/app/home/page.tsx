'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import Layout from '../components/Layout';
import { fetchPantryItems } from '../services/pantryService';
import { green, brown, red, grey } from '@mui/material/colors';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useUser } from '../context/UserContext';

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

const Dashboard: React.FC = () => {
  const [pantry, setPantry] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchItems = async () => {
      if (user && user.uid) {
        const items = await fetchPantryItems(user.uid);
        setPantry(items);
      }
    };
    fetchItems();
  }, [user]);

  const totalItems = pantry.length;
  const totalQuantity = pantry.reduce((acc, item) => acc + item.quantity, 0);
  const categories = Array.from(new Set(pantry.map(item => item.category)));
  const totalCategories = categories.length;
  const categoryData = categories.map(category => ({
    name: category,
    value: pantry.filter(item => item.category === category).reduce((acc, item) => acc + item.quantity, 0),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '32px 0', backgroundColor: 'transparent', width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', padding: 2 }} className="pacifico-font">
              Pantry Dashboard
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Paper elevation={3} sx={{ padding: 2, flex: 1, marginRight: 2 }}>
                <Typography variant="h6" className="merienda-font">Total Items</Typography>
                <Typography variant="body1">{totalItems}</Typography>
              </Paper>
              <Paper elevation={3} sx={{ padding: 2, flex: 1, marginRight: 2 }}>
                <Typography variant="h6" className="merienda-font">Total Items Quantity</Typography>
                <Typography variant="body1">{totalQuantity}</Typography>
              </Paper>
              <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                <Typography variant="h6" className="merienda-font">Total Categories</Typography>
                <Typography variant="body1">{totalCategories}</Typography>
              </Paper>
            </Box>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" className="merienda-font">Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default Dashboard;