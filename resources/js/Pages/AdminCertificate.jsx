import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, MenuItem, Chip, Snackbar, Alert, CircularProgress,
  IconButton, Typography
} from '@mui/material';
import { Add, Edit, Delete, Description } from '@mui/icons-material';
import { Autocomplete } from '@mui/lab';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayjs from 'dayjs';

const statusColors = {
  Pending: 'warning',
  Ongoing: 'info',
  Completed: 'success',
  Rejected: 'error'
};

const certificateTypes = [
  "Barangay Clearance",
  "Certificate of Indigency",
  "First-Time Job Seeker Certificate",
  "Certificate of Residency",
  "Business Permit",
  "Barangay ID"
];

export default function AdminCertificateRequests() {
  const { certificateRequests = [], users = [], flash } = usePage().props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState({
    certificateRequestID: null,
    userID: null,
    certificateType: '',
    status: 'Pending',
    purpose: '',
    remarks: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (flash?.success) {
      setSnackbar({
        open: true,
        message: flash.success,
        severity: 'success'
      });
    }
    if (flash?.error) {
      setSnackbar({
        open: true,
        message: flash.error,
        severity: 'error'
      });
    }
  }, [flash]);

  const handleOpen = (request = null) => {
    setCurrentRequest(request ? { 
      ...request,
      userID: request.user?.id || null
    } : {
      certificateRequestID: null,
      userID: null,
      certificateType: '',
      status: 'Pending',
      purpose: '',
      remarks: ''
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!currentRequest.userID || !currentRequest.certificateType || !currentRequest.purpose) {
        setSnackbar({
            open: true,
            message: 'Please fill all required fields',
            severity: 'error'
        });
        return;
    }

    setLoading(true);
    const isEdit = !!currentRequest.certificateRequestID;
    const method = isEdit ? 'put' : 'post';
    const url = isEdit 
        ? `/admincertificate/${currentRequest.certificateRequestID}` 
        : '/admincertificate';

    // Prepare the data to match backend expectations
    const requestData = {
        userID: currentRequest.userID,
        certificateType: currentRequest.certificateType,
        purpose: currentRequest.purpose,
        remarks: currentRequest.remarks || null,
        // Only include status if editing
        ...(isEdit && { status: currentRequest.status })
    };

    router[method](url, requestData, {
        onSuccess: () => {
            setOpen(false);
            setSnackbar({
                open: true,
                message: `Request ${isEdit ? 'updated' : 'created'} successfully`,
                severity: 'success'
            });
        },
        onError: (errors) => {
            setSnackbar({
                open: true,
                message: `Failed to ${isEdit ? 'update' : 'create'} request`,
                severity: 'error'
            });
        },
        onFinish: () => setLoading(false)
    });
};

  const handleDelete = (id) => {
    if (window.confirm('Delete this request?')) {
      router.delete(`/admincertificate/${id}`);
    }
  };

  return (
    <AuthenticatedLayout header="Certificate Requests">
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          Add New Request
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Certificate Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificateRequests.length > 0 ? (
                certificateRequests.map(request => (
                  <TableRow key={request.certificateRequestID}>
                    <TableCell>#{request.certificateRequestID}</TableCell>
                    <TableCell>{request.user?.name || 'Unknown'}</TableCell>
                    <TableCell>{request.certificateType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        color={statusColors[request.status]} 
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography noWrap>{request.purpose}</Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(request.created_at).format('MMM D, YYYY')}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleOpen(request)} 
                        disabled={loading}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(request.certificateRequestID)} 
                        disabled={loading}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box py={4}>
                      <Description fontSize="large" color="action" />
                      <Typography>No requests found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            {currentRequest.certificateRequestID ? 'Edit Request' : 'New Request'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Autocomplete
                options={users}
                getOptionLabel={(user) => user.name}
                value={users.find(u => u.id === currentRequest.userID) || null}
                onChange={(e, user) => setCurrentRequest({
                  ...currentRequest,
                  userID: user?.id || null
                })}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="User" 
                    required
                    error={!currentRequest.userID}
                    helperText={!currentRequest.userID ? "Required" : ""}
                  />
                )}
                disabled={!!currentRequest.certificateRequestID}
              />

              <TextField
                select
                label="Certificate Type"
                value={currentRequest.certificateType}
                onChange={(e) => setCurrentRequest({
                  ...currentRequest,
                  certificateType: e.target.value
                })}
                fullWidth
                margin="normal"
                required
                error={!currentRequest.certificateType}
                helperText={!currentRequest.certificateType ? "Required" : ""}
              >
                {certificateTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Purpose"
                value={currentRequest.purpose}
                onChange={(e) => setCurrentRequest({
                  ...currentRequest,
                  purpose: e.target.value
                })}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                required
                error={!currentRequest.purpose}
                helperText={!currentRequest.purpose ? "Required" : ""}
              />

              <TextField
                label="Remarks"
                value={currentRequest.remarks}
                onChange={(e) => setCurrentRequest({
                  ...currentRequest,
                  remarks: e.target.value
                })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />

              {currentRequest.certificateRequestID && (
                <TextField
                  select
                  label="Status"
                  value={currentRequest.status}
                  onChange={(e) => setCurrentRequest({
                    ...currentRequest,
                    status: e.target.value
                  })}
                  fullWidth
                  margin="normal"
                >
                  {Object.keys(statusColors).map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !currentRequest.userID || 
                !currentRequest.certificateType || !currentRequest.purpose}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {currentRequest.certificateRequestID ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          <Alert severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AuthenticatedLayout>
  );
}