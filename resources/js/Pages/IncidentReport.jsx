import React, { useState } from "react";
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, IconButton, Typography 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit } from "@mui/icons-material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const IncidentReport = () => {
  // Sample incident data
  const [incidents, setIncidents] = useState([
    { id: 1, title: "Fire Outbreak", description: "Small fire at Barangay Hall", status: "Resolved" },
    { id: 2, title: "Flood", description: "Heavy flooding near main street", status: "Ongoing" }
  ]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: "", description: "", status: "" });

  // Open modal for adding or editing
  const handleOpen = (incident = { id: null, title: "", description: "", status: "" }) => {
    setFormData(incident);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => setOpen(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save incident (add or update)
  const handleSave = () => {
    if (formData.id) {
      setIncidents(incidents.map(inc => inc.id === formData.id ? formData : inc));
    } else {
      setIncidents([...incidents, { ...formData, id: incidents.length + 1 }]);
    }
    handleClose();
  };

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpen(params.row)}>
          <Edit />
        </IconButton>
      ),
    },
  ];

  return (
    <AuthenticatedLayout header="Incident Reports">
    <Box sx={{ height: 400, width: "100%", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Incident Reports</Typography>
      
      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Incident
      </Button>

      <DataGrid rows={incidents} columns={columns} pageSize={5} />

      {/* Modal for Add/Edit Incident */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{formData.id ? "Edit Incident" : "Add Incident"}</DialogTitle>
        <DialogContent>
          <TextField 
            label="Title" 
            fullWidth 
            margin="dense"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="dense"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
          />
          <TextField 
            label="Status" 
            fullWidth 
            margin="dense"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AuthenticatedLayout>
  );
};

export default IncidentReport;
