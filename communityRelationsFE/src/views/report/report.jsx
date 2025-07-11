import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Line, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
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
  LineElement,
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

const COLORS = [
  "#2F5D0B", "#6aa84f", "#93c47d", "#ffbf00", "#ffcf40",
  "#ffdc73", "#ff9900", "#e69138", "#cc6600"
];

const Reports = () => {
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });
  const [radarData, setRadarData] = useState({ labels: [], datasets: [] });
  const [polarData, setPolarData] = useState({ labels: [], datasets: [] });

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

  const generateLineData = () => {
    const timeModes = ["week", "month", "year"];
    const datasets = [];
    let allLabels = new Set();

    timeModes.forEach((mode, index) => {
      const grouped = {};
      data.forEach((item) => {
        const key = formatDateKey(item.date_Time, mode);
        grouped[key] = (grouped[key] || 0) + 1;
        allLabels.add(key);
      });
      const sortedLabels = Array.from(allLabels).sort();
      const dataset = {
        label: `${mode.charAt(0).toUpperCase() + mode.slice(1)}ly` + " Requests",
        data: sortedLabels.map((label) => grouped[label] || 0),
        borderColor: COLORS[index],
        backgroundColor: COLORS[index],
        fill: false,
      };
      datasets.push(dataset);
    });

    setLineData({ labels: Array.from(allLabels).sort(), datasets });
  };

  const generateRadarData = () => {
    const week = {}, month = {}, year = {};

    data.forEach((item) => {
      const act = item.comm_Category || "Unknown";
      week[act] = (week[act] || 0) + 1;
      month[act] = (month[act] || 0) + 1;
      year[act] = (year[act] || 0) + 1;
    });

    const labels = Array.from(new Set([...Object.keys(week), ...Object.keys(month), ...Object.keys(year)]));

    setRadarData({
      labels,
      datasets: [
        {
          label: "Weekly",
          data: labels.map((l) => week[l] || 0),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
        {
          label: "Monthly",
          data: labels.map((l) => month[l] || 0),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Yearly",
          data: labels.map((l) => year[l] || 0),
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
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
    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    setPolarData({
      labels,
      datasets: [
        {
          label: "Requests by Barangay",
          data: values,
          backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        },
      ],
    });
  };

useEffect(() => {
  axios.get(`${config.baseApi1}/request/history`)
    .then((res) => {
      if (Array.isArray(res.data)) {
        const active = res.data.filter(item => item.is_active === true);
        setData(active);
      } else {
        setData([]);
      }
    })
    .catch(console.error);
}, []);

  useEffect(() => {
    if (data.length) {
      generateLineData();
      generateRadarData();
      generatePolarData();
    }
  }, [data]);

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Box sx={{ mb: 5 }}>
        <h3>Requests Over Time</h3>
        {lineData?.datasets?.length > 0 && lineData?.labels?.length > 0 ? (
          <Line data={lineData} options={{ responsive: true }} height={100} />
        ) : (
          <p>Loading Line Chart...</p>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <h3>Category Comparison</h3>
          {radarData?.datasets?.length > 0 && radarData?.labels?.length > 0 ? (
            <Radar data={radarData} options={{ responsive: true }} height={300} />
          ) : (
            <p>Loading Radar Chart...</p>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <h3>Requests by Barangay</h3>
          {polarData?.datasets?.length > 0 && polarData?.labels?.length > 0 ? (
            <PolarArea data={polarData} options={{ responsive: true }} height={300} />
          ) : (
            <p>Loading Polar Chart...</p>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
