import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import image0 from 'assets/images/slide-images/0.jpg';
import image1 from 'assets/images/slide-images/1.jpg';
import image2 from 'assets/images/slide-images/2.jpg';
import image3 from 'assets/images/slide-images/3.jpg';
import image4 from 'assets/images/slide-images/4.jpg';
import image5 from 'assets/images/slide-images/5.jpg';
import image6 from 'assets/images/slide-images/6.jpg';
import image7 from 'assets/images/slide-images/7.jpg';
import image8 from 'assets/images/slide-images/8.jpg';
import image9 from 'assets/images/slide-images/9.jpg';
import image10 from 'assets/images/slide-images/10.jpg';
import image11 from 'assets/images/slide-images/11.jpg';
import image12 from 'assets/images/slide-images/12.jpg';
import image13 from 'assets/images/slide-images/13.jpg';
import image14 from 'assets/images/slide-images/14.jpg';

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentUserPosition, setCurrenUserPosition] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [currentIndex, setCurrentIndex] = useState(0);

  //Slideshow Images
  const images = [
    image0, image1, image2, image3, image4, image5, image6,
    image7, image8, image9, image10, image11, image12, image13, image14
  ];

  //Get User Information from the local storage
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo) {
      setCurrenUserPosition(empInfo.emp_position);
    }
  }, []);

  //Slideshow Animation SlideShow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  //Validation for super admin role
  const handlePendingView = () => {
    if (currentUserPosition === 'super-admin') {
      setSnackbarMsg('Unable to access, Change account to Comrel.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      navigate('/pending');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Left Half - Content */}
      <Box
        sx={{
          width: '30%',
          height: '100%',
          bgcolor: '#2F5D0B',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: { xs: 4, md: 8 },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            color: '#eee',
            mb: 2,
            textAlign: 'left',
            animation: 'pulse 5s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1
              },
              '50%': {
                transform: 'scale(1.05)',
                opacity: 0.8
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1
              }
            }
          }}
        >
          How many have we{' '}
          <Box component="span" sx={{ color: '#ffbf00' }}>
            helped
          </Box>{' '}
          so far?
        </Typography>

        <Typography
          sx={{
            mb: 3,
            fontSize: '1.2rem',
            textAlign: 'left',
            animation: 'pulseText 5s infinite',
            '@keyframes pulseText': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.03)', opacity: 0.9 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        >
          Es-esa Tako, Every act counts.
        </Typography>

        <Button
          variant="contained"
          onClick={handlePendingView}
          sx={{
            backgroundColor: '#ffbf00',
            color: '#000',
            px: 4,
            py: 1,
            fontSize: '1rem',
          }}
        >
          View Pending Request
        </Button>
      </Box>

      {/* Right Half - Slideshow with fade animation */}
      <Box
        sx={{
          width: '70%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            alt={`Slide ${index}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
