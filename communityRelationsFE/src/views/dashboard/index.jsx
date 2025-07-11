import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import image1 from 'assets/images/image2.jpg';
import { useNavigate } from 'react-router-dom'; 

export default function LandingPage() {
  const navigate = useNavigate(); 

  const handlePendingView = () => {
    navigate('/pending'); 
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

      {/* Right Half - Image */}
      <Box
        sx={{
          width: '70%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={image1}
          alt="Hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
}
