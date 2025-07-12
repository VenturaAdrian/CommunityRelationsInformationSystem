import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import {
  Box,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Bar, PolarArea, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  ArcElement
);

const CATEGORY_COLORS = [
  "#A5D8FF", "#B2F2BB", "#FFDAC1", "#FFD6A5",
  "#D0BFFF", "#FFC9DE", "#C3FAE8", "#FFF3BF"
];

const Reports = () => {
  const [data, setData] = useState([]);
  const [chartMode, setChartMode] = useState("month");
  const [overTimeData, setOverTimeData] = useState({ labels: [], datasets: [] });
  const [polarData, setPolarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [statusData, setStatusData] = useState({ labels: [], datasets: [] });
  const [inactiveData, setInactiveData] = useState([]);

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    );
  };

  const formatDateKey = (dateStr, mode) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const week = String(getWeekNumber(date)).padStart(2, "0");

    if (mode === "year") return `${year}`;
    if (mode === "month") return `${year}-${month}`;
    if (mode === "week") return `${year}-W${week}`;
    return dateStr;
  };

  const generateOverTimeData = (mode) => {
    const grouped = {};
    data.forEach((item) => {
      const key = formatDateKey(item.date_Time, mode);
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const sortedLabels = Object.keys(grouped).sort();
    const datasetColor = {
      week: "#4caf50",
      month: "#42a5f5",
      year: "#ffa726",
    };

    setOverTimeData({
      labels: sortedLabels,
      datasets: [
        {
          label: `${mode.charAt(0).toUpperCase() + mode.slice(1)}ly Requests`,
          data: sortedLabels.map((label) => grouped[label]),
          backgroundColor: `${datasetColor[mode]}88`,
          hoverBackgroundColor: datasetColor[mode],
          borderRadius: 8,
          barPercentage: 0.6,
        },
      ],
    });
  };

  const generatePolarData = () => {
    const grouped = {};
    data.forEach((item) => {
      const area = item.comm_Area || "Unknown";
      grouped[area] = (grouped[area] || 0) + 1;
    });

    const sorted = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const labels = sorted.map(([key]) => key);
    const values = sorted.map(([, value]) => value);

    setPolarData({
      labels,
      datasets: [
        {
          label: "Requests by Barangay",
          data: values,
          backgroundColor: labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
          borderWidth: 1,
        },
      ],
    });
  };

  const generatePieData = () => {
    const grouped = {};
    data.forEach((item) => {
      const category = item.comm_Category || "Unknown";
      grouped[category] = (grouped[category] || 0) + 1;
    });

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    setPieData({
      labels,
      datasets: [
        {
          label: "Request Volume",
          data: values,
          backgroundColor: labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
        },
      ],
    });
  };

  const generateStatusData = () => {
    const grouped = {};
    data.forEach((item) => {
      const status = item.req_status || "Unknown";
      grouped[status] = (grouped[status] || 0) + 1;
    });

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    setStatusData({
      labels,
      datasets: [
        {
          label: "Request Status",
          data: values,
          backgroundColor: labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
          borderRadius: 5,
        },
      ],
    });
  };

  useEffect(() => {
    axios.get(`${config.baseApi1}/request/history`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const active = res.data.filter(item => item.is_active === true);
          const inactive = res.data.filter(item => item.is_active === false);
          setData(active);
          setInactiveData(inactive.length);
        } else {
          setData([]);
          setInactiveData([]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (data.length) {
      generateOverTimeData(chartMode);
      generatePolarData();
      generatePieData();
      generateStatusData();
    }
  }, [data, chartMode]);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", background: "linear-gradient(to bottom, #fefce8, #fef9c3)" }}>
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 600, color: "#1b4332" }}>
        Request Analytics Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Box 1 - Request Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={paperStyle}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Total Requests", value: data.length, color: "#4caf50" },
                {
                  label: "Total Reviewed Requests",
                  value: data.filter((item) => item.request_status === "reviewed").length,
                  color: "#42a5f5",
                },
                {
                  label: "Pending Review for Community Relations III",
                  value: data.filter((item) => item.request_status === "Pending review for ComrelIII").length,
                  color: "#ffb74d",
                },
                {
                  label: "Pending Review for Community Relations Department Head",
                  value: data.filter((item) => item.request_status === "Pending review for Comrel DH").length,
                  color: "#ba68c8",
                },
                {
                  label: "Accepted Requests",
                  value: data.filter((item) => item.request_status === "accepted").length,
                  color: "#81c784",
                },
                {
                  label: "Deleted Requests",
                  value: inactiveData,
                  color: "#e57373",
                },
              ].map((item, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      flex: 1,
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1rem" },
                      color: "#1b4332",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.2rem" },
                      color: "#000",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Box 2 - Requests Over Time */}
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={paperStyle}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" sx={titleStyle}>Requests Over Time</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: "#2e7d32" }}>Mode</InputLabel>
                <Select
                  value={chartMode}
                  onChange={(e) => setChartMode(e.target.value)}
                  label="Mode"
                  sx={{ color: "#2e7d32" }}
                >
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="year">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Bar data={overTimeData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Box 3 - Requests Volume Pie */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={paperStyle}>
            <Typography variant="h5" sx={titleStyle}>Requests Volume (Summary)</Typography>
            <Grid container sx={{ flex: 1, mt: 2 }}>
              <Grid item xs={6} sx={{ height: 300 }}>
                <Pie data={pieData} options={pieOptions} />
              </Grid>
              <Grid item xs={6} sx={legendBox}>
                {pieData.labels?.map((label, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        minWidth: 16,
                        minHeight: 16,
                        width: 16,
                        height: 16,
                        backgroundColor: pieData.datasets[0]?.backgroundColor[index],
                        borderRadius: "50%",
                        mr: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2">{label}</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Box 4 - Requests by Barangay */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={paperStyle}>
            <Typography variant="h5" sx={titleStyle}>Requests by Barangay</Typography>
            <Box sx={{ position: 'relative', height: 320 }}>
              <PolarArea data={polarData} options={enhancedPolarOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;

// === Styles & Chart Options ===

const paperStyle = {
  p: 3,
  height: "100%",
  minHeight: 400,
  background: "#ffffffcc",
  borderRadius: 3,
  display: "flex",
  flexDirection: "column",
};

const titleStyle = {
  color: "#1b4332",
  fontWeight: "bold",
};

const legendBox = {
  pl: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflowY: "auto",
  maxHeight: 300,
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#1b5e20",
      bodyColor: "#1b5e20",
      borderColor: "#c8e6c9",
      borderWidth: 1,
      cornerRadius: 4,
      padding: 10,
    },
    legend: {
      labels: {
        color: "#1b5e20",
        font: { weight: "bold" },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#1b5e20" },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    x: {
      ticks: { color: "#1b5e20" },
      grid: { display: false },
    },
  },
  animation: {
    duration: 800,
    easing: "easeOutQuart",
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "#2e7d32",
      bodyColor: "#2e7d32",
    },
    legend: {
      display: false,
    },
  },
};

const enhancedPolarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "#2e7d32",
      bodyColor: "#2e7d32",
      borderColor: "#c8e6c9",
      borderWidth: 1,
      cornerRadius: 4,
      padding: 10,
    },
    legend: {
      position: 'right',
      labels: {
        color: "#1b4332",
        boxWidth: 14,
        padding: 15,
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
  scales: {
    r: {
      ticks: {
        backdropColor: 'transparent',
        color: '#1b4332',
        font: {
          size: 11,
        },
      },
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
      pointLabels: {
        color: '#1b4332',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
  },
  animation: {
    duration: 1000,
    easing: "easeOutBack",
  },
};
