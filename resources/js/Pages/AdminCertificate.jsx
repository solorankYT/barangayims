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
import { Autocomplete } from "@mui/lab";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const AdminCertificateRequests = () => {
  const { certificateRequests = [], users = [] } = usePage().props;
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [certificateData, setCertificateData] = useState({
    certificateRequestID: null,
    userID: null,
    certificateType: "",
    status: "",
    purpose: "",
    remarks: "",
    certificateID: null,
  });

  const handleOpen = (certificate = null) => {
    setIsEditing(!!certificate);
    setCertificateData(
      certificate
        ? { ...certificate }
        : { certificateRequestID: null, userID: null, certificateType: "", status: "", purpose: "", remarks: "", certificateID: null }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCertificateData({ certificateRequestID: null, userID: null, certificateType: "", status: "", purpose: "", remarks: "", certificateID: null });
  };

  const handleSave = () => {
    if (!certificateData.userID || !certificateData.certificateType) {
      alert("User and Certificate Type are required.");
      return;
    }

    const dataToSubmit = {
      ...certificateData,
      certificateID: null,
    };

    if (isEditing) {
      router.put(`/admincertificate/${certificateData.certificateRequestID}`, dataToSubmit, { onSuccess: () => handleClose() });
    } else {
      router.post("/admincertificate", dataToSubmit, { onSuccess: () => handleClose() });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this certificate request?")) {
      router.delete(`/admincertificate/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header="Certificate Requests">
      <Box sx={{ width: "100%", padding: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add New Request
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Certificate Type</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Purpose</b></TableCell>
                <TableCell><b>Remarks</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificateRequests.length > 0 ? (
                certificateRequests.map((cert) => (
                  <TableRow key={cert.certificateRequestID}>
                    <TableCell>{cert.certificateRequestID}</TableCell>
                    <TableCell>{cert.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{cert.certificateType}</TableCell>
                    <TableCell>{cert.status}</TableCell>
                    <TableCell>{cert.purpose}</TableCell>
                    <TableCell>{cert.remarks}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(cert)} color="primary">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No certificate requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Certificate Request Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Certificate Request" : "New Certificate Request"}</DialogTitle>
          <DialogContent>
            
            {/* User Selection with Autocomplete */}
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.name || ""}
              value={users.find((user) => user.id === certificateData.userID) || null}
              onChange={(event, newValue) => {
                setCertificateData({ ...certificateData, userID: newValue ? newValue.id : null });
              }}
              renderInput={(params) => <TextField {...params} label="User" fullWidth margin="dense" />}
            />

            {/* Certificate Type as a Simple Input */}
            <TextField
              select
              label="Certificate Type"
              fullWidth
              margin="dense"
              value={certificateData.certificateType}
              onChange={(e) => setCertificateData({ ...certificateData, certificateType: e.target.value })}
            >
              <MenuItem value="Barangay Clearance">Barangay Clearance</MenuItem>
              <MenuItem value="Certificate of Indigency">Certificate of Indigency</MenuItem>
              <MenuItem value="First-Time Job Seeker Certificate">First-Time Job Seeker Certificate</MenuItem>
            </TextField>
              
            {isEditing && (
              <TextField
                select
                label="Status"
                fullWidth
                margin="dense"
                name="status"
                value={certificateData.status}
                onChange={(e) => setCertificateData({ ...certificateData, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            )}
            <TextField label="Purpose" fullWidth margin="dense" name="purpose" value={certificateData.purpose} onChange={(e) => setCertificateData({ ...certificateData, purpose: e.target.value })} />
            <TextField label="Remarks" fullWidth margin="dense" name="remarks" value={certificateData.remarks} onChange={(e) => setCertificateData({ ...certificateData, remarks: e.target.value })} />
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

export default AdminCertificateRequests;
