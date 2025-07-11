import { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Stack
} from "@mui/material";
import dayjs from "dayjs";

export default function UserLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${config.baseApi}/users/logs`);
        setLogs(response.data);
        setFilteredLogs(response.data);
      } catch (err) {
        console.error("Error fetching user logs:", err);
      }
    };

    fetchLogs();
  }, []);

  const handleFilter = () => {
    const from = dayjs(startDate);
    const to = dayjs(endDate);

    if (!from.isValid() || !to.isValid()) return;

    const result = logs.filter((log) => {
      const logDate = dayjs(log.time_date);
      return logDate.isAfter(from) && logDate.isBefore(to);
    });

    setFilteredLogs(result);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchId(value);

    const filtered = logs.filter((log) =>
      log.id_master.toString().includes(value)
    );
    setFilteredLogs(filtered);
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "darkgreen",
        borderWidth: 2,
      },
      "&:hover fieldset": {
        borderColor: "darkgreen",
      },
      "&.Mui-focused fieldset": {
        borderColor: "darkgreen",
      },
    },
  };

  return (
    <Box sx={{ p: 4, mt: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by ID"
              fullWidth
              value={searchId}
              onChange={handleSearch}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="datetime-local"
              label="Start Date & Time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="datetime-local"
              label="End Date & Time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleFilter}
              sx={{
                height: "100%",
                backgroundColor: "darkgreen",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#145214",
                },
              }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e8f5e9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Updated By</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Changes Made</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.log_id} hover>
                <TableCell>{log.id_master}</TableCell>
                <TableCell>{log.user_id}</TableCell>
                <TableCell>{log.emp_firstname}</TableCell>
                <TableCell>{log.emp_lastname}</TableCell>
                <TableCell>{log.updated_by}</TableCell>
                <TableCell>{new Date(log.time_date).toLocaleString()}</TableCell>
                <TableCell>{log.changes_made}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
