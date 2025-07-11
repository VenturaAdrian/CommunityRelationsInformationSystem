import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import config from 'config';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import Profile from 'assets/images/users/profile.svg';
import { IconLogout, IconSettings, IconUser, IconHelpHexagon } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

export default function AdminSection() {
  const theme = useTheme();
  const { borderRadius } = useConfig();

  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState(''); 

  const [loading, setLoading] = useState(false);

  const anchorRef = useRef(null);

  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    // Get user data to display
    const userdata = JSON.parse(localStorage.getItem('user'));
    if (userdata) {
      const fullname = `${userdata.first_name}` +" "+ `${userdata.last_name}`;
      setUsername(fullname);

      setRole(userdata.role);
      setPosition(userdata.emp_position)
    }
  }, []);

  const HandleLogOut = () => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    setLoading(true)
    axios.post(`${config.baseApi}/users/isactivelogout`,{
      id_master: empInfo.id_master,
      is_active: 0
    })
    
    localStorage.removeItem('user');
    window.location.replace('/');
  };

  const handleAdminPage = () => {
    navigate('/admin-tools');
    
  }
  const HandleFaq = () => {
    navigate('/frequently-asked-questions')
  }

  return (
    <>
      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={Profile}
            alt="user-images"
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <Typography variant="h4">Good Day,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {username}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">
                          {position} {role} 
                        </Typography>
                      </Stack>
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        {role === 'admin' && (
                        <ListItemButton onClick={handleAdminPage} sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 1}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid on container spacing={1} sx={{ justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="body2">Admin Tools</Typography>
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItemButton>
                        )}

                        <ListItemButton onClick={HandleFaq} sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                          <ListItemIcon>
                            <IconHelpHexagon stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">FAQ</Typography>} />
                        </ListItemButton>

                        <ListItemButton onClick={HandleLogOut} sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>

    
  );
}
