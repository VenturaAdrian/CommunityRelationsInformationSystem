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
  Chip
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

export default function Pending() {
  const [historyData, setHistoryData] = useState([]);
  const [userPosition, setUserPosition] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchRequestId, setSearchRequestId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((response) => {
        const activeRequests = response.data.filter(item => item.is_active === true)
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
  }, []);

  useEffect(() => {
    if (userPosition === 'encoder') {
      setFilterStatus('reviewed');
    } else if (userPosition === 'comrelofficer') {
      setFilterStatus('request');
    } else if (userPosition === 'comrelthree') {
      setFilterStatus('Pending review for ComrelIII');
    } else if (userPosition === 'comreldh') {
      setFilterStatus('Pending review for Comrel DH');
    }
  }, [userPosition]);

  const handleReview = (item) => {
    const params = new URLSearchParams({ id: item.request_id });
    navigate(`/review?${params.toString()}`);
  };

  let filteredData = historyData
    .filter((item) =>
      filterStatus ? item.request_status.toLowerCase() === filterStatus.toLowerCase() : true
    )
    .filter((item) =>
      searchRequestId
        ? item.request_id.toString().includes(searchRequestId)
        : true
    );

  filteredData.sort((a, b) =>
    sortOrder === "newest"
      ? b.parsedDate - a.parsedDate
      : a.parsedDate - b.parsedDate
  );

  const getFirstFilePreview = (docsString = "", requestId) => {
    const files = docsString.split(",").map(f => f.trim()).filter(Boolean);
    if (!files.length) return null;
    const imageFile = files.find(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
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
        minHeight: '100vh',
        pt: 8,
        pb: 6,
        px: { xs: 2, md: 6 },
        mt:2,
        background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)'
      }}
    >
      {/* Controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} alignItems="center">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#1b4332" }}>Sort By Date</InputLabel>
          <Select
            value={sortOrder}
            label="Sort By Date"
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{
              color: '#1b4332',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#274e13',
                borderWidth: '2px'
              },
              '& .MuiSvgIcon-root': {
                color: '#1b4332'
              }
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>

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
            "& fieldset": {
              borderColor: "#1b4332",
              borderWidth: "2px"
            },
            "&:hover fieldset": {
              borderColor: "#1b4332"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1b4332"
            }
          },
          "& .MuiSvgIcon-root": {
            color: "#1b4332"
          }
        }}
        />

        {filterStatus && (
          <Chip
            label={`Filtering: ${filterStatus}`}
            sx={{
              bgcolor: "#274e13",
              color: "white",
              fontWeight: "bold"
            }}
          />
        )}
      </Stack>

      {/* Display */}
      {filteredData.length === 0 ? (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="white">
            No {filterStatus} data found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredData.map((item) => {
            const preview = getFirstFilePreview(item.comm_Docs, item.request_id);

            return (
              <Grid item xs={12} md={6} lg={4} key={item.request_id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: '100%',
                    background: '#ffffff',
                    borderRadius: 3,
                    border: '2px solid #274e13',
                    boxShadow: 4,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {preview && preview.isImage ? (
                    <Box
                      component="img"
                      src={preview.fileUrl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = preview.fallbackUrl;
                      }}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#e0e0e0',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                      }}
                    >
                      {preview ? (
                        <Stack spacing={1} alignItems="center">
                          <Typography variant="body2">{preview.fileExt} File</Typography>
                          <Button href={preview.fileUrl} target="_blank" size="small" variant="outlined">
                            View
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No File</Typography>
                      )}
                    </Box>
                  )}

                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Typography variant="subtitle2" color="#274e13">Request ID: {item.request_id}</Typography>
                    <Typography variant="h6" sx={{ color: "#1b4332" }} gutterBottom>{item.comm_Act}</Typography>
                    <Typography variant="body2"><strong>Status:</strong> {item.request_status}</Typography>
                    <Typography variant="body2"><strong>Community Area:</strong> {item.comm_Area}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Date:</strong>{" "}
                      {item.parsedDate ? item.parsedDate.toLocaleString() : "Invalid Date"}
                    </Typography>

                    <Box mt={2} textAlign="right">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#274e13", '&:hover': { bgcolor: "#1b4332" } }}
                        onClick={() => handleReview(item)}
                      >
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
    </Box>
  );
}