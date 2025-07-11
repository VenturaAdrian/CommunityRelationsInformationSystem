// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import logo from 'assets/images/logo1.png';
import logoDark from 'assets/images/logo-dark.svg'; // ✅ Make sure this is available

// ==============================|| LOGO COMPONENT ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === 'dark' ? logoDark : logo}
      alt="My Logo"
      style={{
        width: '50px',      // ✅ Responsive width
        height: 'auto',     // ✅ Maintain aspect ratio
        maxWidth: '100px',  // ✅ Optional: limit max width
        display: 'block',   // ✅ Prevents extra spacing in inline elements
      }}
    />
  );
}
