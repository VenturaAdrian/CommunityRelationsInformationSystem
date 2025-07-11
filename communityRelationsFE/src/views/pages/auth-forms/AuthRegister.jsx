import { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthRegister() {
  const [empFirstName, setEmpFirstName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [createdby, setCreatedBy] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
      setFirstName(empInfo.first_name);
      setLastName(empInfo.last_name);
    }
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const Register = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !empFirstName.trim() ||
      !empLastName.trim() ||
      !userName.trim() ||
      !email.trim() ||
      !empPosition ||
      !empRole ||
      !password ||
      !confirmPassword
    ) {
      setDialogMessage("All fields are required.");
      setDialogOpen(true);
      return;
    }

    if (!emailPattern.test(email)) {
      setDialogMessage("Please enter a valid email address.");
      setDialogOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setDialogOpen(true);
      return;
    }

    try {
      await axios.post(`${config.baseApi1}/request/register`, {
        emp_firstname: empFirstName,
        emp_lastname: empLastName,
        user_name: userName,
        emp_email: email,
        updated_by: createdby,
        emp_position: empPosition,
        pass_word: password,
        emp_role: empRole,
        first_name: firstname,
        last_name: lastname
      });

      setDialogMessage("Registered successfully!");
      setDialogOpen(true);

      // Reset form fields
      setEmpFirstName('');
      setEmpLastName('');
      setUserName('');
      setEmail('');
      setEmpPosition('');
      setEmpRole('');
      setPassword('');
      setConfirmPassword('');

      // Delay reload to allow dialog to show
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setDialogMessage("Registration failed. Please try again.");
      setDialogOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={Register}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" value={empFirstName} onChange={(e) => setEmpFirstName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" value={empLastName} onChange={(e) => setEmpLastName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              helperText={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Invalid email format" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={empRole}
                label="Role"
                onChange={(e) => setEmpRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="position-label">Position</InputLabel>
              <Select
                labelId="position-label"
                value={empPosition}
                label="Position"
                onChange={(e) => setEmpPosition(e.target.value)}
              >
                <MenuItem value="encoder">Encoder</MenuItem>
                <MenuItem value="comrelofficer">Comrel Officer</MenuItem>
                <MenuItem value="comrelthree">Comrel III</MenuItem>
                <MenuItem value="comreldh">Comrel Department Head</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" color="primary">
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
