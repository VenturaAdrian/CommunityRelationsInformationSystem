import {
  Grid,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  HistoryEdu as HistoryEduIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [currentUserPosition, setCurrentUserPosition] = useState('');
  const [adminTools, setAdminTools] = useState([]);

  //Get User Information from local storage
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    const position = empInfo?.emp_position;
    setCurrentUserPosition(position);

    //Validating Admin Funstion based on position
    //Tools for Super Admin
    if (position === 'super-admin') {
      setAdminTools([
        {
          label: 'Register User',
          icon: PersonAddIcon,
          action: () => navigate('/register'),
          gradient: 'linear-gradient(135deg, #2F5D0B, #4e7726)',
        },
        {
          label: 'Edit User',
          icon: EditIcon,
          action: () => navigate('/userpanel'),
          gradient: 'linear-gradient(135deg, #556B2F, #7C9A3C)',
        },
        {
          label: 'User Logs',
          icon: DescriptionIcon,
          action: () => navigate('/userlogs'),
          gradient: 'linear-gradient(135deg, #B8860B, #FFD700)',
        },
        {
          label: 'Request Logs',
          icon: HistoryEduIcon,
          action: () => navigate('/request-logs'),
          gradient: 'linear-gradient(135deg, #8B8000, #FFF8DC)',
        },
      ]);
    } else {
      //Tools For Admin
      setAdminTools([
        {
          label: 'Register User',
          icon: PersonAddIcon,
          action: () => navigate('/register'),
          gradient: 'linear-gradient(135deg, #2F5D0B, #4e7726)',
        },
        {
          label: 'User Logs',
          icon: DescriptionIcon,
          action: () => navigate('/userlogs'),
          gradient: 'linear-gradient(135deg, #B8860B, #FFD700)',
        },
        {
          label: 'Request Logs',
          icon: HistoryEduIcon,
          action: () => navigate('/request-logs'),
          gradient: 'linear-gradient(135deg, #8B8000, #FFF8DC)',
        },
      ]);
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 4,
        py: 6,
        pt: 6,
        background: 'linear-gradient(to bottom right, #1b3d08, #2F5D0B)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h1"
        fontWeight={700}
        color="white"
        sx={{ mb: 6, letterSpacing: 1 }}
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={4} maxWidth="lg" justifyContent="center">
        {adminTools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                onClick={tool.action}
                elevation={6}
                sx={{
                  height: 180,
                  background: tool.gradient,
                  color: 'white',
                  borderRadius: 4,
                  cursor: 'pointer',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background:
                      'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent)',
                    transform: 'rotate(25deg)',
                    zIndex: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    zIndex: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <IconComponent sx={{ fontSize: 36 }} />
                </Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ zIndex: 1 }}
                >
                  {tool.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
