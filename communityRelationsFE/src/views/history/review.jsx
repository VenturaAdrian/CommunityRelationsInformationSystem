import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Snackbar,
  Grid,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export default function Review() {
  const requestID = new URLSearchParams(window.location.search).get('id');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const [formData, setFormData] = useState(null);
  const [userID, setUserID] = useState("");
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [lockActive, setLockActive] = useState(false); // 🔑 controls lock interval

  const navigate = useNavigate();
  const commentRef = useRef(null);

  //Get User Information from local storage
  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    setUserID(empInfo?.id_master);

    if (empInfo?.user_name)
      setCurrentUser(empInfo.user_name);
    setPosition(empInfo?.emp_position || '');
    setRole(empInfo?.role || '');
  }, []);

  //Fetch  Request/Comments from the requestID
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Get all Request
        const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
          params: { id: requestID }
        });

        const data = requestRes.data;

        setFormData(data);
        console.log(data)
        setStatus(data.request_status);

        //Get all comments base on the request_ID
        const commentsRes = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [requestID]);


  //Edit/Delete Validation based on their position
  const ShowEditDelete = () => {
    if (role === 'admin' || (position === 'encoder' && status === 'reviewed')) {
      return true;
    }
    if (position === 'comrelofficer' ||
      position === 'comrelthree' ||
      position === 'comreldh') {
      return false;
    }
  }

  //Accept/Decline validation based on the Status and Position
  const canShowDeclineAccept = () => {
    if (!formData) return false;

    if (status === 'reviewed' && position === 'encoder') return false;
    if (status === 'request' && position === 'encoder') return false;

    if (status === 'request' && position === 'comrelofficer') return true;
    if (status === 'reviewed' && position === 'comrelofficer') return false;

    const { comrelofficer, comrelthree, comreldh } = formData;

    // ======== comrelofficer logic ========
    if (position === 'comrelofficer') {
      if (comrelofficer === true && comrelthree === true && comreldh === true ||
        (comrelofficer === false && comrelthree === true && comreldh === false) ||
        (comrelofficer === false && comrelthree === true && comreldh === true) ||
        (comrelofficer === true && comrelthree === false && comreldh === true)
      ) {
        return false;
      }
      else if (comrelofficer === true && comrelthree === false && comreldh === false ||
        (comrelofficer === false && comrelthree === false && comreldh === false)
      ) {
        return true;
      }
    }

    // ======== comrelthree logic ========
    if (position === 'comrelthree') {
      if (comrelthree === true && comrelofficer === true && comreldh === true ||
        (comrelofficer === false && comrelthree === false && comreldh === false) ||
        (comrelofficer === false && comrelthree === true && comreldh === false) ||
        (comrelofficer === false && comrelthree === false && comreldh === true)
      ) {
        return false;
      }
      else if (comrelthree === true && comrelofficer === true && comreldh === true ||
        (comrelofficer === true && comrelthree === false && comreldh === false)
      ) {
        return true
      };

    }

    // ======== comreldh logic ========
    if (position === 'comreldh') {
      if (comrelofficer === false && comrelthree === false && comreldh === false ||
        (comrelofficer === true && comrelthree === false && comreldh === false) ||
        (comrelofficer === false && comrelthree === true && comreldh === false)
      ) {
        return false;
      }
      else if (comrelofficer === true && comrelthree === true && comreldh === true ||
        (comrelofficer === true && comrelthree === true && comreldh === false)
      ) {
        return true;
      }
    }
    return false;
  };

  //Comment Submit Function
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(`${config.baseApi1}/request/comment`, {
        comment,
        created_by: currentUser,
        request_id: requestID
      });

      setComment('');
      const res = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
      setComments(res.data);

      await axios.post(`${config.baseApi1}/request/comment-decline`, {
        request_id: requestID,
        emp_position: position,
        id_master: userID,
        currentUser
      });

      const updatedReq = await axios.get(`${config.baseApi1}/request/editform`, { params: { id: requestID } });
      setFormData(updatedReq.data);

      await axios.post(`${config.baseApi1}/request/email-post-decline`, {
        id_master: userID,
        comm_Area: formData.comm_Area,
        comm_Act: formData.comm_Act,
        comm_Desc: formData.comm_Desc,
        request_id: requestID,
        comment: comment,
        date_Time: formData.date_Time
      });

      // 🔓 Unlock after submitting
      const empInfo = JSON.parse(localStorage.getItem('user'));
      await axios.post(`${config.baseApi1}/request/unlock`, {
        request_id: requestID,
        locked_by: empInfo?.user_name,
      });

      setLockActive(false); // stop lock interval


      setSnackbarMsg(res.data.message || 'Your comment was successfully submitted.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => window.location.replace('/comrel/pending'), 1000);

    } catch (err) {
      console.error('Error submitting comment:', err);
      setSnackbarMsg('Failed to submit.', err);
      setSnackbarSeverity('error', err);
      setSnackbarOpen(true);
    }
  };

  //Show Delete Component
  const handleDelete = () => setShowDeleteConfirm(true);

  //Delete Function
  const confirmDelete = async () => {
    try {
      await axios.get(`${config.baseApi1}/request/delete-request`, {
        params: {
          request_id: requestID,
          currentUser: currentUser
        }
      });
      setSnackbarMsg('You have successfully deleted the request.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => window.location.replace('/comrel/pending'), 1000);

    } catch (err) {
      console.error('Failed to delete request:', err);
      setSnackbarMsg('Failed to delete.', err);
      setSnackbarSeverity('error', err);
      setSnackbarOpen(true);
    }
  };

  //Decline Function
  const handleDecline = async () => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    setShowComments(true);
    setLockActive(true); // 🔒 Start locking
    setTimeout(() => commentRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };


  //Accept Function
  const handleAccept = async () => {
    try {
      const res = await axios.post(`${config.baseApi1}/request/accept`, {
        request_id: requestID,
        emp_position: position,
        id_master: userID,
        currentUser
      });

      await axios.post(`${config.baseApi1}/request/email-post`, {
        id_master: userID,
        date_Time: formData.date_Time,
        request_id: requestID,
        comm_Area: formData.comm_Area,
        comm_Act: formData.comm_Act,
        comm_Desc: formData.comm_Desc
      });

      const updatedReq = await axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      });

      setFormData(updatedReq.data);


      setSnackbarMsg(res.data.message || 'Your have succesfully accpeted the request.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => window.location.replace('/comrel/pending'), 1000);

    } catch (err) {
      console.error('Accept request error:', err);
      setSnackbarMsg('Failed to Accept, please try again', err);
      setSnackbarSeverity('error', err);
      setSnackbarOpen(true);
    }
  };

  const empInfo = JSON.parse(localStorage.getItem('user'));
  const [lock, setLock] = useState(true)
  // Edit Page
  const handleEdit = async () => {
    const params = new URLSearchParams({ id: requestID });
    const empInfo = JSON.parse(localStorage.getItem('user'));
    const updatedReq = await axios.get(`${config.baseApi1}/request/editform`, {
      params: { id: requestID }
    });
    const RealtimeRequest = updatedReq.data;
    if (RealtimeRequest.is_locked === '1' && RealtimeRequest.locked_by !== empInfo.user_name) {
      console.log(RealtimeRequest.user_name)
      setLock(false)
      setSnackbarMsg('Someone is currently editing this request. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    else if (RealtimeRequest.is_locked === '0') {
      try {
        await axios.post(`${config.baseApi1}/request/lock`, {
          request_id: requestID,
          locked_by: empInfo?.user_name || 'unknown'
        })
      } catch (err) {
        alert(err.response?.data?.message || "Ticket locked by another user")
      }
    }

    navigate(`/edit?${params.toString()}`)
  };

  //
  useEffect(() => {

    const interval = setInterval(async () => {
      const empInfo = JSON.parse(localStorage.getItem('user'));
      const updatedReq = await axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      });
      const RealtimeRequest = updatedReq.data;

      if (RealtimeRequest.is_locked === '1' && RealtimeRequest.locked_by !== empInfo.user_name) {
        setSnackbarMsg('Someone is currently editing this request. Please try again later.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLock(false)


      }
      else if (RealtimeRequest.is_locked === '0' || RealtimeRequest.is_locked === null || RealtimeRequest.locked_by === empInfo.user_name) {
        setLock(true)
        setSnackbarOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);

  }, [])

  // auto lock unlock


  useEffect(() => {
    if (!lockActive) return;
    const { user_name, role, position } = empInfo || {};
    const currentUser = user_name;
    const currentRequestId = requestID;

    const checker = async () => {
      try {
        await axios.post(`${config.baseApi1}/request/lock`, {
          request_id: currentRequestId,
          locked_by: currentUser,
        });
      } catch (err) {
        setSnackbarMsg(err.response?.data?.message || "Someone is currently editing this request. Please try again later.");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    checker();

    const handleUnload = () => {
      if (!currentRequestId || !currentUser) return;


      const payload = JSON.stringify({
        request_id: currentRequestId,
        locked_by: currentUser,
      });

      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(`${config.baseApi1}/request/unlock`, blob);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);

      if (currentRequestId && currentUser) {
        axios.post(`${config.baseApi1}/request/unlock`, {
          request_id: requestID,
          locked_by: currentUser
        }).catch(() => { });
      }

    };
  }, [requestID, empInfo, lockActive]);


  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        pt: 4,
        background: 'linear-gradient(to bottom, #ffdc73, #bf9b30)',

        boxShadow: 4,
      }}
    >
      {formData ? (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} flexWrap="wrap">
          {/* Left: Request Info */}
          <Box flex={2} minWidth={0}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                position: 'relative',
              }}
            >
              {ShowEditDelete() && (
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }} >
                  <IconButton onClick={handleEdit} sx={{ color: 'green' }} disabled={!lock}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} sx={{ color: 'red' }} disabled={!lock}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              <CardContent
                sx={{
                  background: 'linear-gradient(#ffffff, #e5e5e5)',
                  borderRadius: 3,
                  p: 4,
                }}
              >
                <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
                  Request ID: {formData.request_id}
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'gray' }} />

                <Grid container spacing={2}>
                  {[
                    ['Status', formData.request_status],
                    ['Author', formData.created_by
                      ? formData.created_by.charAt(0).toUpperCase() + formData.created_by.slice(1).toLowerCase()
                      : 'none'
                    ],
                    ['Updated By', formData.updated_by
                      ? formData.updated_by.charAt(0).toUpperCase() + formData.updated_by.slice(1).toLowerCase()
                      : 'none'
                    ],
                    ['Community', formData.comm_Area],
                    ['Activity', formData.comm_Act],
                    ['Category', formData.comm_Category],
                    ['Date/Time', formData.date_Time],
                    ['Venue', formData.comm_Venue],
                    ['Guests', formData.comm_Guest],
                    ['Employees', formData.comm_Emps],
                    ['Beneficiaries', formData.comm_Benef],
                    ['Description', formData.comm_Desc],
                  ].map(([label, value]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <Typography variant="body1">
                        <strong>{label}:</strong> {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Supporting Documents */}
                {formData.comm_Docs && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                      Supporting Documents
                    </Typography>
                    <Grid container spacing={2}>
                      {formData.comm_Docs.split(',').map((file, index) => {
                        const fileTrimmed = file.trim();
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileTrimmed);
                        const fileUrl = `${config.baseApi1}/files/${fileTrimmed}`;
                        const fallbackUrl = `${config.baseApi1}/files/request_${formData.request_id}/images/${fileTrimmed}`;

                        return (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box
                              sx={{
                                border: '2px solid #2F5D0B',
                                borderRadius: 2,
                                p: 2,
                                background: '#fff',
                                height: '100%',
                                boxShadow: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              {isImage ? (
                                <img
                                  src={fileUrl}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackUrl;
                                  }}
                                  alt={`Document ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: 140,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    height: 140,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    {fileTrimmed.split('.').pop().toUpperCase()} File
                                  </Typography>
                                </Box>
                              )}
                              <Typography
                                variant="body2"
                                sx={{ mt: 1, wordBreak: 'break-word', whiteSpace: 'normal' }}
                                title={fileTrimmed}
                              >
                                {fileTrimmed}
                              </Typography>
                              <Button
                                size="small"
                                href={fileUrl || fallbackUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                sx={{
                                  mt: 1,
                                  backgroundColor: '#2F5D0B',
                                  color: 'white',
                                  '&:hover': { backgroundColor: '#244805' },
                                }}
                              >
                                View
                              </Button>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Right: Comments */}
          <Box flex={1} minWidth={0}>
            <Typography variant="h6" gutterBottom>
              All Comments
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {comments.length > 0 ? (
              comments.map((cmt) => (
                <Paper key={cmt.comment_id} sx={{ mb: 2, p: 2, borderLeft: '4px solid #2F5D0B' }}>
                  <Typography variant="subtitle2">{cmt.created_by}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(cmt.created_at).toLocaleString()}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{cmt.comment}</Typography>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">No comments yet.</Typography>
            )}

            {showComments && (
              <Box mt={3} ref={commentRef}>
                <TextField
                  label="Comment / Feedback"
                  fullWidth
                  multiline
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleCommentSubmit}
                  sx={{ mt: 2 }}
                  disabled={!comment.trim()}
                  fullWidth
                >
                  Submit Comment
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Typography>Loading request data...</Typography>
      )}

      {/* Accept/Decline Buttons */}
      {canShowDeclineAccept() && (
        <Stack mt={5} direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="error" onClick={handleDecline} disabled={!lock}>
            Decline
          </Button>
          <Button variant="contained" color="primary" onClick={handleAccept} disabled={!lock}>
            Accept
          </Button>
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
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
