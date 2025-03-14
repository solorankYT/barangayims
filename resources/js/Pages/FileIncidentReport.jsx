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
  const { auth } = usePage().props; 
  const [incidentData, setIncidentData] = useState({
    resident_id: auth.user.id, 
    title: "",
    incident_type: "",
    description: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setIncidentData({ ...incidentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    router.post("/incidentreport", incidentData, { onSuccess: () => handleClose() });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>File an Incident Report</DialogTitle>
      <DialogContent>
        <TextField label="Resident" fullWidth margin="dense" value={auth.user.name}  />

        <TextField name="title" label="Title" fullWidth margin="dense" onChange={handleChange} />
        <TextField name="incident_type" label="Incident Type" fullWidth margin="dense" onChange={handleChange} />
        <TextField name="description" label="Description" fullWidth margin="dense" multiline rows={3} onChange={handleChange} />
        <TextField name="status" label="Status" fullWidth margin="dense" disabled value={incidentData.status} />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileIncidentReport;
