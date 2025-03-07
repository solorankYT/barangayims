import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, TextField, Select, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Typography, FormControl,
  InputLabel
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { router, usePage } from "@inertiajs/react";

const AdminCertificate = () => {
  const { applications } = usePage().props; // Fetch applications from backend
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let filtered = applications.filter(app => 
      app.full_name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? app.status === statusFilter : true)
    );
    setFilteredApplications(filtered);
  }, [search, statusFilter, applications]);

  const handleView = (application) => {
    setSelectedApplication(application);
  };

  const handleClose = () => {
    setSelectedApplication(null);
  };

  const handleUpdateStatus = (status) => {
    router.put(`/certificate-application/${selectedApplication.id}`, { status }, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Certificate Applications</Typography>
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Resident</b></TableCell>
              <TableCell><b>Certificate Type</b></TableCell>
              <TableCell><b>Purpose</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.full_name}</TableCell>
                <TableCell>{app.certificate_type}</TableCell>
                <TableCell>{app.purpose}</TableCell>
                <TableCell>
                  <span style={{
                    color: app.status === "Approved" ? "green" : app.status === "Rejected" ? "red" : "orange"
                  }}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleView(app)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Application Modal */}
      {selectedApplication && (
        <Dialog open={Boolean(selectedApplication)} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            <Typography><b>Resident:</b> {selectedApplication.full_name}</Typography>
            <Typography><b>Date of Birth:</b> {selectedApplication.date_of_birth}</Typography>
            <Typography><b>Sex:</b> {selectedApplication.sex}</Typography>
            <Typography><b>Civil Status:</b> {selectedApplication.civil_status}</Typography>
            <Typography><b>Contact Number:</b> {selectedApplication.contact_number}</Typography>
            <Typography><b>Address:</b> {selectedApplication.address}</Typography>
            <Typography><b>Certificate Type:</b> {selectedApplication.certificate_type}</Typography>
            <Typography><b>Purpose:</b> {selectedApplication.purpose}</Typography>
            {selectedApplication.supporting_document && (
              <Typography>
                <b>Supporting Document:</b> 
                <a href={selectedApplication.supporting_document} target="_blank" rel="noopener noreferrer"> View</a>
              </Typography>
            )}
            {selectedApplication.business_name && (
              <>
                <Typography><b>Business Name:</b> {selectedApplication.business_name}</Typography>
                <Typography><b>Business Owner:</b> {selectedApplication.business_owner}</Typography>
                <Typography><b>Business Address:</b> {selectedApplication.business_address}</Typography>
                <Typography><b>Nature of Business:</b> {selectedApplication.business_nature}</Typography>
                <Typography><b>Business Registration No:</b> {selectedApplication.business_registration_number}</Typography>
                {selectedApplication.business_documents && (
                  <Typography>
                    <b>Business Documents:</b> 
                    <a href={selectedApplication.business_documents} target="_blank" rel="noopener noreferrer"> View</a>
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            {selectedApplication.status === "Pending" && (
              <>
                <Button onClick={() => handleUpdateStatus("Rejected")} color="error">Reject</Button>
                <Button onClick={() => handleUpdateStatus("Approved")} color="primary" variant="contained">Approve</Button>
              </>
            )}
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminCertificate;
