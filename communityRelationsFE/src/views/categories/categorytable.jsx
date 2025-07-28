import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import config from 'config';

export default function CategoryTable() {
  const [requestData, setRequestData] = useState([]);
  const [reqData, setReqData] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const category = query.get('category');
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(category || '');

  //Fetch all Accepted/Stored Request
  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((res) => {
        const selectedCategory = res.data.filter(
          (item) =>
            item.comm_Category === decodedCategory &&
            item.is_active === true &&
            item.request_status === 'accepted'
        );

        setRequestData(selectedCategory);
        setReqData(selectedCategory.map((item) => item.request_id));
      })
      .catch((err) => {
        console.error('Error fetching request data:', err);
      });
  }, [decodedCategory]);

  //Navigate to View the Request
  const HandleView = (request_id) => {
    const params = new URLSearchParams({ id: request_id });
    navigate(`/view-request?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)',
        p: 4,
        pt: 6,
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'rgb(0, 45, 13)' }}
      >
        {decodedCategory || 'No category selected.'}
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          mt: 3,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f8e9' }}>
              {['Date/Time', 'Request ID', 'Area', 'Activity', 'Category', 'Description', 'Actions'].map(
                (header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#33691e' }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {requestData.length > 0 ? (
              requestData.map((row) => (
                <TableRow
                  key={row.request_id}
                  hover
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f9fbe7',
                    },
                  }}
                >
                  <TableCell>{row.date_Time.toLocaleString()}</TableCell>
                  <TableCell>{row.request_id}</TableCell>
                  <TableCell>{row.comm_Area}</TableCell>
                  <TableCell>{row.comm_Act}</TableCell>
                  <TableCell>{row.comm_Category}</TableCell>
                  <TableCell>{row.comm_Desc}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => HandleView(row.request_id)}
                      aria-label="View Request"
                    > 
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#757575' }}>
                  No data found for this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
