import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthRegister from '../auth-forms/AuthRegister';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

export default function Register() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRegisterSuccess = () => {
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh', mt:6 }}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: 'calc(100vh - 68px)' }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#" aria-label="theme logo">
                      <Logo />
                    </Link>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={{ xs: 'column-reverse', md: 'row' }}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack spacing={1} alignItems="center" justifyContent="center">
                          <Typography
                            gutterBottom
                            variant={downMD ? 'h3' : 'h2'}
                            sx={{ color: 'primary.dark' }}
                          >
                            Sign up
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}
                          >
                            Enter your details to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <AuthRegister onRegisterSuccess={handleRegisterSuccess} />
                  </Grid>




                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ px: 3, mb: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>

        {/* ✅ Snackbar component */}
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Successfully registered!
          </Alert>
        </Snackbar>
      </Grid>
    </AuthWrapper1>
  );
}
