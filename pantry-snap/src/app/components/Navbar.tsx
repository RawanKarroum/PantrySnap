import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box, Typography, Avatar } from '@mui/material';

const drawerWidth = 240;

const Navbar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Avatar sx={{ width: 56, height: 56, mb: 2 }} />
          <Typography variant="h6">User Name</Typography>
        </Box>
        <List>
          {['Item 1', 'Item 2', 'Item 3'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;
