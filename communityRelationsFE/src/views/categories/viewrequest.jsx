import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Grid,
  Tooltip
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import config from 'config';

export default function ViewRequestPage() {
  const query = new URLSearchParams(useLocation().search);
  const requestId = query.get('id');
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState(null);
  const [allFiles, setAllFiles] = useState([]);

  //Fetch the Request 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${config.baseApi1}/request/editform`, {
          params: { id: requestId },
        });
        setData(res.data);

        const files = res.data?.comm_Docs
          ? res.data.comm_Docs.split(',').map(f => f.trim().replace(/\\/g, '/'))
          : [];
        setAllFiles(files);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    };

    fetchData();
  }, [requestId]);

  //Get User data from localStorage
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    setUserData(empInfo.data)
    console.log(userData)
  },[])

  //Download Function
  const handleDownloadAll = async () => {
    try {
      const response = await axios.post(
        `${config.baseApi1}/request/download-all`,
        { files: allFiles,

         },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Request_${requestId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading all files:', error);
    }
  };

  //View Component for Request Card Component
  const renderPostContent = () => {
    if (!data) return null;

    const {
      comm_Category,
      comm_Benef,
      comm_Area,
      comm_Act,
      comm_Venue,
      date_Time,
      comm_Guest,
      comm_Emps,
      comm_Desc
    } = data;

    return (
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '90%', md: '800px' },
          mx: 'auto',
          my: 10,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: 'white',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>L</Avatar>
              <Box>
                <Typography fontWeight="bold" fontSize={{ xs: 14, sm: 16 }}>
                  Lepanto Community Relations
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {new Date(date_Time).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            {allFiles.length > 0 && (
              <Tooltip title="Download All Files">
                <Button onClick={handleDownloadAll} sx={{ minWidth: 0, padding: 1 }}>
                  <DownloadIcon />
                </Button>
              </Tooltip>
            )}
          </Box>

          <Typography sx={{ mb: 2, fontSize: { xs: 14, sm: 16 } }}>
            <strong>Category:</strong> {comm_Category}<br />
            <strong>Beneficiaries:</strong> {comm_Benef}
          </Typography>

          <Typography sx={{ mb: 2, fontSize: { xs: 14, sm: 16 } }}>
            This was taken at <strong>{comm_Area}</strong> during our <strong>{comm_Act}</strong> at <strong>{comm_Venue}</strong> last <strong>{new Date(date_Time).toLocaleString()}</strong>.<br />
            With our Guest <strong>{comm_Guest}</strong> and Comrel employees <strong>{comm_Emps}</strong>.
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-wrap', mb: 3, fontSize: { xs: 14, sm: 16 } }}>
            {comm_Desc}
          </Typography>

          {allFiles.length > 0 && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {allFiles.map((file, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                  const fileUrl = `${config.baseApi1}/files/${encodeURIComponent(file)}`;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: 2,
                          bgcolor: '#f0f2f5',
                          height: '100%'
                        }}
                      >
                        {isImage ? (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={fileUrl}
                              alt={`Document ${index + 1}`}
                              style={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                            />
                          </a>
                        ) : (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height={200}
                            flexDirection="column"
                            bgcolor="#e4e6eb"
                          >
                            <InsertDriveFileIcon sx={{ fontSize: 48, color: '#606770' }} />
                            <Typography fontSize={12} color="text.secondary">
                              {file.split('.').pop().toUpperCase()} File
                            </Typography>
                            <Button
                              size="small"
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                              sx={{ mt: 1, bgcolor: '#1877f2', textTransform: 'none' }}
                            >
                              View
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)',
        minHeight: '100vh',
        py: { xs: 3, sm: 5 },
        px: { xs: 2, sm: 4 },
      }}
    >
      {data ? renderPostContent() : (
        <Typography textAlign="center">Loading request data...</Typography>
      )}
    </Box>
  );
}
