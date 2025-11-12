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
  IconButton,
  TextField,
  TablePagination,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import config from 'config';

export default function CategoryTable() {
  const [requestData, setRequestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0); // pagination current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page
  const query = new URLSearchParams(useLocation().search);
  const category = query.get('category');
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(category || '');

  // Fetch all Accepted/Stored Request
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
      })
      .catch((err) => {
        console.error('Error fetching request data:', err);
      });
  }, [decodedCategory]);

  // Navigate to View the Request
  const HandleView = (request_id) => {
    const params = new URLSearchParams({ id: request_id });
    navigate(`/view-request?${params.toString()}`);
  };

  // Filtering logic
  const filteredData = requestData.filter((row) => {
    const author = row.updated_by ? row.updated_by : row.created_by || '';
    return (
      author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.request_id.toString().includes(searchTerm) ||
      row.comm_Area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.comm_Act?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.comm_Desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic (slice data)
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
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

      {/* Search bar */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: 'transparent',
          color: "#1b4332",
          input: { color: "#1b4332" },
          label: { color: "#1b4332" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#1b4332", borderWidth: "2px" },
            "&:hover fieldset": { borderColor: "#1b4332" },
            "&.Mui-focused fieldset": { borderColor: "#1b4332" }
          },
          "& .MuiSvgIcon-root": { color: "#1b4332" }
        }}
      />

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          mt: 1,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f8e9' }}>
              {['Date/Time', 'Author', 'Request ID', 'Area', 'Activity', 'Category', 'Description', 'Actions'].map(
                (header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#33691e' }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.request_id}
                  hover
                  sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { backgroundColor: '#f9fbe7' },
                  }}
                >
                  <TableCell>{new Date(row.date_Time).toLocaleString()}</TableCell>
                  <TableCell>
                    {row.updated_by
                      ? row.updated_by.charAt(0).toUpperCase() + row.updated_by.slice(1).toLowerCase()
                      : row.created_by
                        ? row.created_by.charAt(0).toUpperCase() + row.created_by.slice(1).toLowerCase()
                        : 'none'}
                  </TableCell>
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
                <TableCell colSpan={8} align="center" sx={{ py: 3, color: '#757575' }}>
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    </Box>
  );
}
