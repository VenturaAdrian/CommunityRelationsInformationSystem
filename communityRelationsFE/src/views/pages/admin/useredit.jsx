import { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Divider,
  Stack,
  Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LockIcon from "@mui/icons-material/Lock";

export default function UserEdit() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  const [username, setUsername] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    emp_firstname: "",
    emp_lastname: "",
    emp_position: "",
    emp_email: "",
    user_name: "",
    emp_role: "",
    pass_word: "",
    is_active: true
  });

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem("user"));
    setUsername(empInfo?.user_name || "");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${config.baseApi}/users/useredit`, {
          params: { id: userId }
        });
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value
    }));
  };

  const getChangesLog = () => {
    const changes = [];

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        changes.push(
          `Changed ${key} from '${originalData[key]}' to '${formData[key]}'`
        );
      }
    });

    return changes.join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changesLog = getChangesLog();
    if (!changesLog) {
      alert("No changes were made.");
      return;
    }

    try {
      await axios.post(`${config.baseApi}/request/update-user`, {
        id_master: userId,
        emp_firstname: formData.emp_firstname,
        emp_lastname: formData.emp_lastname,
        user_name: formData.user_name,
        emp_position: formData.emp_position,
        emp_email: formData.emp_email,
        emp_role: formData.emp_role,
        pass_word: formData.pass_word,
        is_active: formData.is_active,
        created_by: username,
        changes_log: changesLog
      });

      alert(`Updated ${formData.user_name} successfully!`);
      window.location.replace('/comrel/userpanel');
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Update failed.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: "linear-gradient(to right, #f0f4ff, #ffffff)"
      }}
    >
      <Card
        elevation={10}
        sx={{
          borderRadius: 4,
          maxWidth: 700,
          width: "100%",
          backdropFilter: "blur(6px)",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              <EditIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Edit User Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update user profile and login access
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="emp_firstname"
                value={formData.emp_firstname}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="emp_lastname"
                value={formData.emp_lastname}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <AssignmentIndIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

             <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="emp_email"
                value={formData.emp_email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <AssignmentIndIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="position-label">Position</InputLabel>
                <Select
                  labelId="position-label"
                  name="emp_position"
                  value={formData.emp_position}
                  label="Position"
                  onChange={handleChange}
                >
                  <MenuItem value="encoder">Encoder</MenuItem>
                  <MenuItem value="comrelofficer">Comrel Officer</MenuItem>
                  <MenuItem value="comrelthree">Comrel Three</MenuItem>
                  <MenuItem value="comreldh">Comrel DH</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="emp_role"
                  value={formData.emp_role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="pass_word"
                value={formData.pass_word}
                onChange={handleChange}
                type="password"
                fullWidth
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="is_active"
                  value={formData.is_active.toString()}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 5,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "bold",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
