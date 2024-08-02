import React, { ReactNode } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
