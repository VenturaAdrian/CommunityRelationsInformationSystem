import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Button, Stack, Box, TextField, InputAdornment
} from '@mui/material';
import {
  IconPencil,
  IconTrash,
  IconCircleCheck,
  IconCircleX
} from '@tabler/icons-react';
import SearchIcon from '@mui/icons-material/Search';

export default function UserPanel() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${config.baseApi}/users/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  };

  const handleEdit = (id) => {
    const params = new URLSearchParams({ id });
    window.location.replace(`/comrel/usereditpanel?${params.toString()}`);
  };

  const handleDelete = async (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const user_name = userData?.user_name || 'unknown';

    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await axios.delete(`${config.baseApi}/users/delete/${id}`, {
          params: { updated_by: user_name }
        });

        setUsers(prev => prev.filter(user => user.id_master !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.id_master.toString().includes(term) ||
      user.emp_firstname.toLowerCase().includes(term) ||
      user.emp_lastname.toLowerCase().includes(term)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#2F5D0B' }}>
        User Management Panel
      </Typography>

      <TextField
        label="Search by ID, First Name, or Last Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#2F5D0B' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: '#2F5D0B',
            },
            '&:hover fieldset': {
              borderColor: '#2F5D0B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2F5D0B',
              borderWidth: '2px',
            }
          }
        }}
      />

      <TableContainer component={Paper} elevation={4} sx={{ mt: 3, borderRadius: '12px' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#E8F5E9' }}>
            <TableRow>
              {[
                'ID', 'First Name', 'Last Name', 'Username',
                'Position', 'Role', 'Created At',
                'Updated At', 'Active', 'Actions'
              ].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', color: '#2F5D0B' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id_master} hover sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#f1f8e9' } }}>
                <TableCell>{user.id_master}</TableCell>
                <TableCell>{user.emp_firstname}</TableCell>
                <TableCell>{user.emp_lastname}</TableCell>
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.emp_position}</TableCell>
                <TableCell>{user.emp_role}</TableCell>
                <TableCell>
                  {user.created_at ? new Date(user.created_at).toLocaleString() : ''}
                </TableCell>
                <TableCell>
                  {user.updated_at ? new Date(user.updated_at).toLocaleString() : ''}
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <IconCircleCheck color="green" size={20} title="Active" />
                  ) : (
                    <IconCircleX color="red" size={20} title="Inactive" />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => handleEdit(user.id_master)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#2F5D0B',
                        borderColor: '#2F5D0B',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#2F5D0B',
                          color: '#fff',
                          borderColor: '#2F5D0B'
                        }
                      }}
                      startIcon={<IconPencil size={18} />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(user.id_master)}
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                          color: '#fff',
                          borderColor: '#d32f2f'
                        }
                      }}
                      startIcon={<IconTrash size={18} />}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
