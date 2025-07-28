import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  TextField,
  Snackbar,
  Alert,
  Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [userPosition, setUserPosition] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchRequestId, setSearchRequestId] = useState("");
  const [currentUserData, setCurrentUserData] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  // Fetch all Active Requests
  // Sort the data to newest - oldest
  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((response) => {
        const activeRequests = response.data
          .filter((item) => item.is_active === true)
          .map((item) => {
            const cleaned = item.created_at
              ?.replace(/\s+/g, " ")
              .replace(/(\d)(AM|PM)/i, "$1 $2")
              .trim();
            const parsedDate = new Date(cleaned);
            return {
              ...item,
              parsedDate: isNaN(parsedDate) ? null : parsedDate,
            };
          });

        setHistoryData(activeRequests);
      })
      .catch((error) => {
        console.error("ERROR FETCHING FE:", error);
      });

    const empInfo = JSON.parse(localStorage.getItem("user"));
    setUserPosition(empInfo?.emp_position || "");
    setCurrentUserData(empInfo);
  }, []);

  //Navigation to Review Page
  const handleReview = (item) => {
    //Validation for 'super-admin'
    if (userPosition === 'super-admin') {
      setSnackbarMsg('Unable to access, Change account to Comrel.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      const params = new URLSearchParams({ id: item.request_id });
      navigate(`/review?${params.toString()}`);
    }
  };

  //Filter Status/RequestID
  let filteredData = historyData
    .filter((item) =>
      filterStatus
        ? item.request_status.toLowerCase() === filterStatus.toLowerCase()
        : true
    )
    .filter((item) =>
      searchRequestId
        ? item.request_id.toString().includes(searchRequestId)
        : true
    );

  filteredData.sort((a, b) => {
    return sortOrder === "newest"
      ? b.parsedDate - a.parsedDate
      : a.parsedDate - b.parsedDate;
  });

  //Pagenation Function
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Render Image Display
  const getFirstFilePreview = (docsString = "", requestId) => {
    const files = docsString.split(",").map((f) => f.trim()).filter(Boolean);
    if (!files.length) return null;

    const imageFile = files.find((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    const selectedFile = imageFile || files[0];

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedFile);
    const fileUrl = `${config.baseApi1}/files/${selectedFile}`;
    const fallbackUrl = `${config.baseApi1}/files/request_${requestId}/images/${selectedFile}`;
    const fileExt = selectedFile.split(".").pop().toUpperCase();

    return { isImage, fileUrl, fallbackUrl, fileExt };
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 6,
        py: 6,
        px: { xs: 2, md: 6 },
        background: "linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        sx={{ color: "#1b4332" }}
      >
        <TextField
          label="Search Request ID"
          variant="outlined"
          value={searchRequestId}
          onChange={(e) => setSearchRequestId(e.target.value)}
          sx={{
            minWidth: 200,
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

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#1b4332" }} shrink>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            displayEmpty
            renderValue={(selected) => selected === "" ? "All Request" : selected}
            sx={{
              color: "#1b4332",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#1b4332",
                borderWidth: "2px",
              },
              "& .MuiSvgIcon-root": { color: "#1b4332" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Request">Request</MenuItem>
            <MenuItem value="Pending review for ComrelIII">Comrel III</MenuItem>
            <MenuItem value="Pending review for Comrel DH">Comrel Department Head</MenuItem>
            <MenuItem value="Reviewed">Reviewed</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#1b4332" }}>Sort By Date</InputLabel>
          <Select
            value={sortOrder}
            label="Sort By Date"
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{
              color: "#1b4332",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#1b4332",
                borderWidth: "2px",
              },
              "& .MuiSvgIcon-root": { color: "#1b4332" },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {paginatedData.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="white">
            No {filterStatus} data found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {paginatedData.map((item) => {
            const preview = getFirstFilePreview(item.comm_Docs, item.request_id);
            return (
              <Grid item xs={12} md={6} key={item.request_id} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    width: "100%",
                    background: "linear-gradient(#e0e0e0, rgb(220, 219, 219))",
                    border: "2px solid #274e13",
                    borderRadius: 2,
                    boxShadow: 3,
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      m: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f0f0f0",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    {preview ? (
                      preview.isImage ? (
                        <img
                          src={preview.fileUrl}
                          alt="Doc Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = preview.fallbackUrl;
                          }}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2">{preview.fileExt} File</Typography>
                          <Button href={preview.fileUrl} target="_blank" size="small" variant="outlined" sx={{ mt: 1 }}>View</Button>
                        </Box>
                      )
                    ) : (
                      <Typography variant="body2" color="text.secondary">No File</Typography>
                    )}
                  </Box>

                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography><strong>Request ID:</strong> {item.request_id}</Typography>
                      <Typography><strong>Status:</strong> {item.request_status}</Typography>
                      <Typography><strong>Community Area/Barangay:</strong> {item.comm_Area}</Typography>
                      <Typography><strong>Community Activity:</strong> {item.comm_Act}</Typography>
                      <Typography><strong>Category:</strong> {item.comm_Category}</Typography>
                      <Typography><strong>Date/Time:</strong> {item.parsedDate ? item.parsedDate.toLocaleString() : "Invalid Date"}</Typography>
                    </Box>
                    <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button variant="contained" size="small" onClick={() => handleReview(item)}>
                        Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          sx={{
                '& .MuiPaginationItem-root': {
                  color: '#000000ff',
                  borderColor: '#d8b400ff'
                }
              }}
        />
      </Box>
      {/* Alert Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}