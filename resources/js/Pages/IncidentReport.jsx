import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const IncidentReport = () => {
  const { incidents = [], residents = [] } = usePage().props; 
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [incidentData, setIncidentData] = useState({
    id: null,
    resident_id: "",
    title: "",
    incident_type: "",
    description: "",
    status: "",
  });

  const handleOpen = (incident = null) => {
    setIsEditing(!!incident);
    setIncidentData(
      incident
        ? { ...incident, resident_id: incident.resident?.id || "" } // Handle missing resident
        : { id: null, resident_id: "", title: "", incident_type: "", description: "", status: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIncidentData({ id: null, resident_id: "", title: "", incident_type: "", description: "", status: "" });
  };

  const handleSave = () => {
    if (!incidentData.resident_id) {
      alert("Resident is required.");
      return;
    }

    if (isEditing) {
      router.put(`/incidentreport/${incidentData.id}`, incidentData, { onSuccess: () => handleClose() });
    } else {
      router.post("/incidentreport", incidentData, { onSuccess: () => handleClose() });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incident report?")) {
      router.delete(`/incidentreport/${id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <Box sx={{ width: "100%", padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Incident Reports
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Incident
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Resident</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.id}</TableCell>
                    <TableCell>{incident.resident?.name || "No Resident Assigned"}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{incident.incident_type}</TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>{incident.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(incident)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(incident.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No incident reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Incident" : "Add Incident"}</DialogTitle>
          <DialogContent>
            {/* Resident Dropdown */}
            <TextField
              select
              label="Resident"
              fullWidth
              margin="dense"
              name="resident_id"
              value={incidentData.resident_id}
              onChange={(e) => setIncidentData({ ...incidentData, resident_id: e.target.value })}
            >
              <MenuItem value="">Select Resident</MenuItem>
              {residents.map((resident) => (
                <MenuItem key={resident.id} value={resident.id}>
                  {resident.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField label="Title" fullWidth margin="dense" name="title" value={incidentData.title} onChange={(e) => setIncidentData({ ...incidentData, title: e.target.value })} />
            <TextField label="Incident Type" fullWidth margin="dense" name="incident_type" value={incidentData.incident_type} onChange={(e) => setIncidentData({ ...incidentData, incident_type: e.target.value })} />
            <TextField label="Description" fullWidth margin="dense" name="description" value={incidentData.description} onChange={(e) => setIncidentData({ ...incidentData, description: e.target.value })} multiline />
            <TextField label="Status" fullWidth margin="dense" name="status" value={incidentData.status} onChange={(e) => setIncidentData({ ...incidentData, status: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSave} color="primary">{isEditing ? "Update" : "Save"}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AuthenticatedLayout>
  );
};

export default IncidentReport;
