import axios from "axios";
import config from "config";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  Snackbar,
  Alert,
  Backdrop, 
  CircularProgress
} from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

//Barangay Options
const barangayOptions = [
  'Balili', 'Bedbed', 'Bulalacao', 'Cabiten', 'Colalo', 'Guinaoang',
  'Paco', 'Palasaan', 'Poblacion', 'Sapid', 'Tabio', 'Taneg'
];

//Activities Option
const activityOptions = [
  'Medical Mission', 'Reach Out', 'Feeding Program',
  'Rescue', 'Rehabilitation', 'Ayuda'
];

//Category Options
const categoryOptions = [
  'Human Resource Development & Institutional Building (HRDIB)',
  'Enterprise Development & Networking',
  'Assistance to Infrastructure Development & Support Services',
  'Access to Education & Educational Support Programs',
  'Access to Health Services - Health Facilities & Health Professionals',
  'Protection & Respect of Socio-Cultural Values',
  'Information - Education & Communication (IEC)',
  'Development of Mining & GeoSciences & Technology',
  'Concessionaires',
  'Company Facilities',
  'Corporate Social Responsibility -Donations'
]

export default function EditForm() {
  const params = new URLSearchParams(window.location.search);
  const requestID = params.get("id");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [loading, setLoading] = useState(false); 

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [createdby, setCreatedBy] = useState("");
  const [role, setRole] = useState("")
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [position, setPosition] = useState('');


  //Formdata = Raw Data
  //OriginalData = From DB Data
  //Validate any changes commited
  useEffect(() => {
    if (requestID) {
      axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      }).then((response) => {
        const data = response.data || {};
        const preparedData = {
          ...data,
          comm_Area: data.comm_Area?.split(",").map((x) => x.trim()) || [],
          comm_Guest: data.comm_Guest?.split(",").map((x) => x.trim()) || [],
          comm_Emps: data.comm_Emps?.split(",").map((x) => x.trim()) || [],
          comm_Benef: data.comm_Benef?.split(",").map((x) => x.trim()) || []
        };
        setFormData(preparedData);
        setOriginalData({
          comm_Area: preparedData.comm_Area,
          comm_Act: preparedData.comm_Act,
          date_Time: preparedData.date_Time,
          comm_Venue: preparedData.comm_Venue,
          comm_Guest: preparedData.comm_Guest,
          comm_Emps: preparedData.comm_Emps,
          comm_Benef: preparedData.comm_Benef,
          comm_Category: preparedData.comm_Category,
          comm_Desc: preparedData.comm_Desc,
          comm_Docs: preparedData.comm_Docs
        });
        setStatus(data.request_status);
      });
    }

    //Get User Informations
    const empInfo = JSON.parse(localStorage.getItem("user"));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
      setPosition(empInfo.emp_position);
      setRole(empInfo.emp_role)
    }
  }, []);

  //Check Changes for text Fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  //Check changes for Files 
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setErrors((prev) => ({ ...prev, comm_Docs: false }));
    }
  };

  //Remove selected files
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //Validate Fields
  const validateFields = () => {
    const newErrors = {};
    if (!formData.comm_Area || formData.comm_Area.length === 0) newErrors.comm_Area = true;
    if (!formData.comm_Act) newErrors.comm_Act = true;
    if (!formData.date_Time) newErrors.date_Time = true;
    if (!formData.comm_Venue) newErrors.comm_Venue = true;
    if (!formData.comm_Guest || formData.comm_Guest.length === 0) newErrors.comm_Guest = true;
    if (!formData.comm_Emps || formData.comm_Emps.length === 0) newErrors.comm_Emps = true;
    if (!formData.comm_Benef || formData.comm_Benef.length === 0) newErrors.comm_Benef = true;
    if (!formData.comm_Category) newErrors.comm_Category = true;
    if (!formData.comm_Desc) newErrors.comm_Desc = true;
    return newErrors;
  };

  //Detect Changes from Original data then compare to FormData
  const detectChanges = () => {
    const changes = [];
    const keys = [
      "comm_Area", "comm_Act", "date_Time", "comm_Venue",
      "comm_Guest", "comm_Emps", "comm_Benef",
      "comm_Category", "comm_Desc"
    ];

    keys.forEach((key) => {
      const oldVal = Array.isArray(originalData[key])
        ? originalData[key].join(", ")
        : originalData[key];

      const newVal = Array.isArray(formData[key])
        ? formData[key].join(", ")
        : formData[key];

      if (oldVal !== newVal) {
        changes.push(`Changed ${key} from "${oldVal}" to "${newVal}"`);
      }
    });

    //Detect Changes from Original data then compare to FormData
    if (selectedFiles.length > 0) {
      const newFileNames = selectedFiles.map(file => file.name).join(", ");
      const oldFileNames = originalData.comm_Docs?.split(',').map(name => name.split('/').pop()).join(', ') || 'None';
      changes.push(`Changed comm_Docs from "${oldFileNames}" to "${newFileNames}"`);
    }

    return changes.join("; ");
  };

  //Save Edited Request
 const handleSave = () => {
  const validationErrors = validateFields();
  setErrors(validationErrors);
  
  if (Object.keys(validationErrors).length > 0) return;

  //Validation Position
  let updatedStatus = status;
  if (position === 'encoder' && status === 'reviewed') {
    updatedStatus = 'request';
  } else if(position === 'encoder'|| role ==='admin' && status !== 'reviewed'){
    updatedStatus = status;
  } else if ((position === 'comrelofficer' || position === 'comrelthree' || position === 'comreldh') && role ==='admin' ) {
    updatedStatus = status;
  }
  
  setLoading(true)

  const changes_made = detectChanges();

  const data = new FormData();
  data.append("request_id", requestID);
  data.append("comm_Area", formData.comm_Area.join(", "));
  data.append("comm_Act", formData.comm_Act);
  data.append("date_Time", formData.date_Time);
  data.append("comm_Venue", formData.comm_Venue);
  data.append("comm_Guest", formData.comm_Guest.join(", "));
  data.append("comm_Emps", formData.comm_Emps.join(", "));
  data.append("comm_Benef", formData.comm_Benef.join(", "));
  data.append("comm_Category", formData.comm_Category);
  data.append("comm_Desc", formData.comm_Desc);
  data.append("created_by", createdby);
  data.append("emp_position", position);
  data.append("request_status", updatedStatus);
  data.append("changes_made", changes_made);

  if (selectedFiles.length > 0) {
    selectedFiles.forEach(file => data.append("comm_Docs", file));
  } else {
    data.append("existingFileName", formData.comm_Docs);
  }


  axios.post(`${config.baseApi1}/request/updateform`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(() => {
      setSnackbarMsg('Form submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => window.location.replace('/comrel/pending'), 1000);

  })
  .catch((err) => {
    setSnackbarMsg('Failed to submit.');
      setSnackbarSeverity('error', err);
      setSnackbarOpen(true);
  });
};

  // Validate if No data
  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4, p: 2, background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 2, mb: 2 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Edit Request ID: {requestID}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={barangayOptions}
              value={formData.comm_Area}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Area: val }));
                setErrors((prev) => ({ ...prev, comm_Area: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Community Area / Barangay"
                  error={!!errors.comm_Area}
                  helperText={errors.comm_Area ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={activityOptions}
              value={formData.comm_Act}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Act: val || '' }));
                setErrors((prev) => ({ ...prev, comm_Act: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type of Community Activity"
                  error={!!errors.comm_Act}
                  helperText={errors.comm_Act ? "Required" : ""}
                />
              )}
            />
          </Grid>

                    <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={categoryOptions}
              value={formData.comm_Category}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Category: val || '' }));
                setErrors((prev) => ({ ...prev, comm_Category: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="SDG Category"
                  name="comm_Category"
                  fullWidth
                  error={!!errors.comm_Category}
                  helperText={errors.comm_Category ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Date and Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date_Time}
              name="date_Time"
              onChange={handleChange}
              error={!!errors.date_Time}
              helperText={errors.date_Time ? "Required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Venue / Place"
              fullWidth
              name="comm_Venue"
              value={formData.comm_Venue}
              onChange={handleChange}
              error={!!errors.comm_Venue}
              helperText={errors.comm_Venue ? "Required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.comm_Guest}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Guest: val }));
                setErrors((prev) => ({ ...prev, comm_Guest: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Guests and People Involved"
                  error={!!errors.comm_Guest}
                  helperText={errors.comm_Guest ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel shrink>Replace Supporting Documents</InputLabel>
            <Button variant="contained" component="label">
              Upload Files
              <input
                type="file"
                hidden
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>

            {formData.comm_Docs && selectedFiles.length === 0 && (
              <Typography variant="body2" mt={1}>
                Current Files: {formData.comm_Docs}
              </Typography>
            )}

            {selectedFiles.length > 0 && (
              <List dense>
                {selectedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.comm_Emps}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Emps: val }));
                setErrors((prev) => ({ ...prev, comm_Emps: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="COMREL Employees Involved"
                  error={!!errors.comm_Emps}
                  helperText={errors.comm_Emps ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.comm_Benef}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Benef: val }));
                setErrors((prev) => ({ ...prev, comm_Benef: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Beneficiaries"
                  error={!!errors.comm_Benef}
                  helperText={errors.comm_Benef ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Community Activity Description"
              name="comm_Desc"
              fullWidth
              multiline
              rows={4}
              value={formData.comm_Desc}
              onChange={handleChange}
              error={!!errors.comm_Desc}
              helperText={errors.comm_Desc ? "Required" : ""}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Alert/Loading Components */}
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
    <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
