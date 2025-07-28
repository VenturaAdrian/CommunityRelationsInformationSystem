// DifferentDevice.jsx

import { useState } from "react";
import axios from 'axios';
import config from 'config';
import { Box, Button, Typography, Card, CardContent, CardActions, Backdrop, CircularProgress } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DifferentDevice = () => {
  const [loading, setLoading] = useState(false);  
  
  //Log out User from the Browser
  const handleLogoutFromOtherDevice = () => {
    const empInfo = JSON.parse(localStorage.getItem('user'));

    setLoading(true)

    axios.post(`${config.baseApi}/users/isactivelogout`,{
      id_master: empInfo.id_master,
      is_active: 0
    })
    
    localStorage.removeItem('user');
    window.location.replace('/');
    
  };
    setTimeout(() => {
        localStorage.removeItem('user');
        window.location.replace('/')
    },10000);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: 500, p: 4, boxShadow: 5 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            You are currently logged in on a different device.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            To continue logging in here, you need to log out the account from the other device.
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={handleLogoutFromOtherDevice}
          >
            Log out account from other device
          </Button>
        </CardActions>
      </Card>

      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </Box>
  );
};

export default DifferentDevice;
