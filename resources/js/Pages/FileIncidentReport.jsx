import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";

const FileIncidentReport = ({ open, handleClose }) => {
  const { auth, errors } = usePage().props;
  const [incidentData, setIncidentData] = useState({
    resident_id: auth.user.id,
    title: "",
    incidentType: "", // Changed to match backend
    description: "",
  });

  const handleChange = (e) => {
    setIncidentData({ ...incidentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    router.post("/incidentreport", incidentData, { 
      onSuccess: () => handleClose(),
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>File an Incident Report</DialogTitle>
      <DialogContent>
        <TextField 
          label="Resident" 
          fullWidth 
          margin="dense" 
          value={auth.user.name} 
          disabled
        />

        <TextField 
          name="title" 
          label="Title" 
          fullWidth 
          margin="dense" 
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          required
        />
        
        <TextField
          name="incidentType" // Changed to match backend
          label="Incident Type"
          fullWidth
          margin="dense"
          onChange={handleChange}
          error={!!errors.incidentType}
          helperText={errors.incidentType}
          required
        />
        
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="dense"
          multiline
          rows={3}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={!incidentData.title || !incidentData.incidentType || !incidentData.description}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileIncidentReport;