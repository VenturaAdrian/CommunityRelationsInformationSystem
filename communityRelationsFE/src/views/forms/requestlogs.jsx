import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  Stack,
  Button
} from "@mui/material";

export default function RequestLogs() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/request-logs`)
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
      });
  }, []);

  useEffect(() => {
    let filtered = data;

    if (searchId.trim() !== "") {
      filtered = filtered.filter((log) =>
        log.request_id.toString().includes(searchId)
      );
    }

    if (startDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.time_date);
        return logDate >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.time_date);
        return logDate <= new Date(endDate);
      });
    }

    setFilteredData(filtered);
  }, [searchId, startDate, endDate, data]);

  const handleResetFilters = () => {
    setSearchId("");
    setStartDate("");
    setEndDate("");
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '2px',
        borderColor: 'darkgreen'
      },
      '&:hover fieldset': {
        borderColor: 'darkgreen'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'darkgreen'
      }
    }
  };

  return (
    <Box sx={{ mt: 6, px: 4, py: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
        <TextField
          label="Search by Request ID"
          variant="outlined"
          size="small"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={inputStyles}
        />
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={inputStyles}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={inputStyles}
        />
        <Button 
          variant="outlined" 
          color="success"
          onClick={handleResetFilters}
          sx={{
            backgroundColor: 'darkgreen',
            color: 'white',
            '&:hover': {
              backgroundColor: '#005500',
            },
            borderRadius: '6px',
            textTransform: 'none',
          }}
        >
          Reset
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#E8F5E9' }}>
            <TableRow>
              {[
                'Request ID', 'Status', 'Category', 'Area',
                'Activity', 'Date/Time', 'Changes Made'
              ].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', color: '#2F5D0B' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((log, index) => (
              <TableRow key={index} hover sx={{ transition: '0.2s', '&:hover': { backgroundColor: '#f1f8e9' } }}>
                <TableCell>{log.request_id}</TableCell>
                <TableCell>{log.request_status}</TableCell>
                <TableCell>{log.comm_Category}</TableCell>
                <TableCell>{log.comm_Area}</TableCell>
                <TableCell>{log.comm_Act}</TableCell>
                <TableCell>
                  {log.time_date ? new Date(log.time_date).toLocaleString() : ""}
                </TableCell>
                <TableCell>{log.changes_made}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
