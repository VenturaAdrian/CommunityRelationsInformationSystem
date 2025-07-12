import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import logo from 'assets/images/logo-4.png';
import logo1 from 'assets/images/logo-5.png';
import logoDark from 'assets/images/logo-dark.svg';

export default function Logo1() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 'auto', sm: '300px' }, // allow layout to shrink
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Main Logo (logo-4) */}
      <Box
        component="img"
        src={theme.palette.mode === 'dark' ? logoDark : logo}
        alt="Main Logo"
        sx={{
          height: '50px',
          objectFit: 'contain',
        }}
      />

      {/* Secondary Logo (logo-5) - hidden on xs/sm */}
      <Box
        component="img"
        src={theme.palette.mode === 'dark' ? logoDark : logo1}
        alt="Secondary Logo"
        sx={{
          height: '30px',
          objectFit: 'contain',
          marginLeft: '70%',
          top: '10px',
          display: {
            xs: 'none',
            sm: 'none', // hidden on extra-small and small screens
            lg: 'block', // visible on medium (≥900px) and up
          },
        }}
      />
    </Box>
  );
}
