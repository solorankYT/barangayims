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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { Autocomplete } from "@mui/lab";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const IncidentReport = () => {
  const { incidents = [], residents = [] } = usePage().props;

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentData, setIncidentData] = useState({
    id: null,
    resident_id: null,
    title: "",
    incidentType: "",
    description: "",
    status: "",
  });

  const handleOpen = (incident = null) => {
    setIsEditing(!!incident);
    setIncidentData(
      incident
        ? { ...incident, resident_id: incident.resident?.id || null }
        : { id: null, resident_id: null, title: "", incidentType: "", description: "", status: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIncidentData({ id: null, resident_id: null, title: "", incidentType: "", description: "", status: "" });
  };

  const handleSave = () => {
    if (!incidentData.resident_id) {
      alert("Resident is required.");
      return;
    }

    let dataToSubmit = { ...incidentData };

    if (!isEditing) {
      delete dataToSubmit.id;
      delete dataToSubmit.status;
    }

    if (isEditing) {
      router.put(`/incidentreport/${incidentData.id}`, dataToSubmit, { onSuccess: () => handleClose() });
    } else {
      router.post("/incidentreport", dataToSubmit, { onSuccess: () => handleClose() });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incident report?")) {
      router.delete(`/incidentreport/${id}`);
    }
  };

  const filteredIncidents = incidents.filter((incident) =>
    [incident.id.toString(), incident.resident?.name, incident.title, incident.incidentType, incident.description, incident.status]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AuthenticatedLayout header="Incident Reports">
      <Box sx={{ width: "100%", padding: 3 }}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search by ID, Resident, Title, Type, Status..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
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
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.id}</TableCell>
                    <TableCell>{incident.resident?.name || "No Resident Assigned"}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{incident.incidentType || "No Type Specified"}</TableCell>
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

        {/* Add/Edit Incident Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Incident" : "Add Incident"}</DialogTitle>
          <DialogContent>
            {/* Resident Autocomplete */}
            <Autocomplete
              options={residents}
              getOptionLabel={(option) => option.name || ""}
              value={residents.find((res) => res.id === incidentData.resident_id) || null}
              onChange={(event, newValue) => {
                setIncidentData({ ...incidentData, resident_id: newValue ? newValue.id : null });
              }}
              renderInput={(params) => <TextField {...params} label="Resident" fullWidth margin="dense" />}
            />

            <TextField label="Title" fullWidth margin="dense" name="title" value={incidentData.title} onChange={(e) => setIncidentData({ ...incidentData, title: e.target.value })} />

            <TextField
              select
              label="Incident Type"
              fullWidth
              margin="dense"
              name="incidentType"
              value={incidentData.incidentType}
              onChange={(e) => setIncidentData({ ...incidentData, incidentType: e.target.value })}
            >
              <MenuItem value="Noise Disturbance">Noise Disturbance</MenuItem>
              <MenuItem value="Family or Domestic Issue">Family or Domestic Issue</MenuItem>
              <MenuItem value="Property or Boundary Concern">Property or Boundary Concern</MenuItem>
              <MenuItem value="Peace and Order Complaint">Peace and Order Complaint</MenuItem>
              <MenuItem value="Sanitation or Environmental Issue">Sanitation or Environmental Issue</MenuItem>
              <MenuItem value="Animal-Related Concern">Animal-Related Concern</MenuItem>
              <MenuItem value="Business or Permit Violation">Business or Permit Violation</MenuItem>
              <MenuItem value="Theft or Property Damage">Theft or Property Damage</MenuItem>
              <MenuItem value="Violation of Barangay Ordinance">Violation of Barangay Ordinance</MenuItem>
              <MenuItem value="Others (Please Specify)">Others (Please Specify)</MenuItem>
            </TextField>

            {/* Show additional input if "Others" is selected */}
            {incidentData.incidentType === "Others (Please Specify)" && (
              <TextField
                label="Please Specify"
                fullWidth
                margin="dense"
                name="customIncidentType"
                value={incidentData.customIncidentType || ""}
                onChange={(e) => setIncidentData({ ...incidentData, customIncidentType: e.target.value })}
              />
            )}

            <TextField
              label="Description"
              fullWidth
              margin="dense"
              name="description"
              value={incidentData.description}
              onChange={(e) => setIncidentData({ ...incidentData, description: e.target.value })}
              multiline
            />

            {isEditing && (
              <TextField
                select
                label="Status"
                fullWidth
                margin="dense"
                name="status"
                value={incidentData.status}
                onChange={(e) => setIncidentData({ ...incidentData, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            )}
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
