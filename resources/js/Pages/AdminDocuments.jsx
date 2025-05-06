import React, { useState, useMemo } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, MenuItem, InputAdornment, Chip, Grid, 
  Typography, Divider, Select, FormControl, InputLabel, Stepper, Step,
  StepLabel, Alert, Avatar, Checkbox, FormControlLabel, LinearProgress,
  TableFooter, TablePagination, Snackbar,
  FormGroup,
  RadioGroup,
  Radio
} from "@mui/material";
import { 
  Add, Edit, Search, Check, Close, Download, 
  Visibility, Person, Business, Work, Receipt 
} from "@mui/icons-material";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const AdminDocuments = () => {
  const { documentRequests = [], users = [], documentTypes: backendDocumentTypes = [], errors } = usePage().props;
  const documentTypes = backendDocumentTypes.length > 0 
    ? backendDocumentTypes 
    : [
        { documentTypeID: 1, name: 'Barangay Clearance' },
        { documentTypeID: 2, name: 'Certificate of Indigency' },
        { documentTypeID: 3, name: 'First Time Job Seeker Certificate' },
        { documentTypeID: 4, name: 'Barangay Business Permit' },
        { documentTypeID: 5, name: 'Barangay Blotter Report' }
      ];

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRequest, setCurrentRequest] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    document_type_id: ''
  });

  const handleOpen = (request = null) => {
    setCurrentRequest(request || {
      id: null,
      user_id: users.length ? users[0].id : null,
      document_type_id: documentTypes.length ? documentTypes[0].documentTypeID : null,
      status: 'Pending',
      pickupOption: '',
      purpose: '',
      remarks: '',
      staff_notes: '',
      full_name: '',  
      business_name: '',
      business_address: '',
      monthly_income: '',
      is_first_time_jobseeker: false
    });
    setOpen(true);
    setActiveStep(0);
  };

  const handleEdit = (request) => {
    setCurrentRequest(request);
    setReadOnly(true); // Set the dialog to read-only mode
    setOpen(true);
    setActiveStep(0);
  };
  const handleStatusChange = async (id, status, notes = '') => {
    setLoading(true);
    try {
      if (status === 'Rejected' && !notes) {
        notes = prompt('Please enter rejection reason:');
        if (notes === null) return;
      }
      
      await router.put(`/AdminDocuments/${id}`, {
        status,
        staff_notes: notes
      });
      showSnackbar('Status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar('Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredRequests = useMemo(() => {
    return documentRequests
      .filter(request => {
        const user = request.user || {};
        const matchesSearch = 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (documentTypes.find(t => t.documentTypeID === request.documentTypeID)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.status.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filter === "all" || 
          (filter === "pending" && request.status === "Pending") ||
          (filter === "approved" && request.status === "Approved") ||
          (filter === "rejected" && request.status === "Rejected");
        
        const matchesAdvancedFilters = (
          (!advancedFilters.document_type_id || request.documentTypeID == advancedFilters.document_type_id)
        );
        
        return matchesSearch && matchesFilter && matchesAdvancedFilters;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [documentRequests, searchTerm, filter, advancedFilters, documentTypes]);



  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = {
        userID: currentRequest.user_id,
        documentTypeID: currentRequest.document_type_id,
        purpose: currentRequest.purpose,
        remarks: currentRequest.remarks,
        status: currentRequest.status || 'Pending',
        pickupOption: currentRequest.pickupOption,
      };
  
      // If the request has an ID, it should be an update
      if (currentRequest.id) {
        await router.put(`/AdminDocuments/${currentRequest.id}`, formData);
        showSnackbar('Request updated successfully', 'success');
      } else {
        // Otherwise, create a new request
        await router.post('/AdminDocuments', formData);
        showSnackbar('Request saved successfully', 'success');
      }
      
      setOpen(false); // Close the modal after submission
    } catch (error) {
      console.error('Error saving request:', error);
      showSnackbar('Failed to save request', 'error');
    } finally {
      setLoading(false);
    }
  };
  

  const statusColors = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error'
  };

  const getDocumentIcon = (documentTypeId) => {
    const type = documentTypes.find(t => t.documentTypeID == documentTypeId);
    if (!type) return <Receipt />;
    
    switch(type.name) {
      case 'Barangay Business Permit': return <Business color="primary" />;
      case 'First Time Job Seeker Certificate': return <Work color="action" />;
      case 'Certificate of Indigency': return <Receipt color="secondary" />;
      case 'Barangay Blotter Report': return <Edit color="info" />;
      default: return <Receipt />;
    }
  };

  const getDocumentName = (documentTypeId) => {
    const type = documentTypes.find(t => t.documentTypeID == documentTypeId);
    return type?.name || 'Unknown Document Type';
  };

  return (
    <AuthenticatedLayout header="Document Requests Management">
      <Box sx={{ p: 3 }}>
        {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
        
        {/* Header with actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
            >
              Add Request
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "contained" : "outlined"}
              color="warning"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "contained" : "outlined"}
              color="success"
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "rejected" ? "contained" : "outlined"}
              color="error"
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={advancedFilters.document_type_id}
                onChange={(e) => setAdvancedFilters({...advancedFilters, document_type_id: e.target.value})}
                label="Document Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {documentTypes.map(type => (
                  <MenuItem key={type.documentTypeID} value={type.documentTypeID}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2, minWidth: 200, flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">Total Requests</Typography>
            <Typography variant="h4">{documentRequests.length}</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 200, flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">Pending</Typography>
            <Typography variant="h4" color="warning.main">
              {documentRequests.filter(r => r.status === 'Pending').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 200, flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">Approved</Typography>
            <Typography variant="h4" color="success.main">
              {documentRequests.filter(r => r.status === 'Approved').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 200, flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">Rejected</Typography>
            <Typography variant="h4" color="error.main">
              {documentRequests.filter(r => r.status === 'Rejected').length}
            </Typography>
          </Paper>
        </Box>

        {/* Requests Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Resident</TableCell>
                <TableCell>Document Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pickup Option</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
                  <TableRow key={request.id} hover>

                    {/* Request ID */}
                    <TableCell>#{request.id}</TableCell>

                    {/* Resident Name */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {request.user?.name?.charAt(0) || '?'}
                        </Avatar>
                        {request.user?.name || 'N/A'}
                      </Box>
                    </TableCell>

                    {/* Document Type */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDocumentIcon(request.documentTypeID)}
                        {getDocumentName(request.documentTypeID)}
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        color={statusColors[request.status]}
                        variant={request.status === 'Pending' ? 'outlined' : 'filled'}
                      />
                    </TableCell>

                    {/* Pickup Option */}
                    <TableCell>
                      <Chip
                      label={request.pickupOption}
                      
                      />
                      
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      {new Date(request.created_at).toLocaleString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEdit(request)}
                        color="primary"
                        title="View Details"
                        aria-label="View details"
                      >
                        <Visibility />
                      </IconButton>
                      {request.status === 'Pending' && (
                        <>
                          <IconButton 
                            onClick={() => handleStatusChange(request.id, 'Approved')}
                            color="success"
                            title="Approve"
                            aria-label="Approve"
                          >
                            <Check />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleStatusChange(request.id, 'Rejected')}
                            color="error"
                            title="Reject"
                            aria-label="Reject"
                          >
                            <Close />
                          </IconButton>
                        </>
                      )}
                      {request.status === 'Approved' && (
                        <IconButton
                          color="primary"
                          title="Download Document"
                          aria-label="Download document"
                          onClick={() => window.open(`/documents/${request.id}/download`, '_blank')}
                        >
                          <Download />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No document requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={filteredRequests.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Request Detail Dialog */}
        
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getDocumentIcon(currentRequest?.document_type_id)}
              <Typography variant="h6">
                {currentRequest?.id 
                  ? `Document Request #${currentRequest.id}`
                  : 'New Document Request'}
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent dividers>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              <Step><StepLabel>Request Details</StepLabel></Step>
              <Step><StepLabel>Resident Information</StepLabel></Step>
              <Step><StepLabel>Verification</StepLabel></Step>
            </Stepper>

            {activeStep === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Document Information
                  </Typography>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={!!errors?.documentTypeID}>
                    <InputLabel>Document Type *</InputLabel>
                    <Select
                      value={currentRequest?.document_type_id  || ''}
                      onChange={(e) => setCurrentRequest({...currentRequest, document_type_id: e.target.value})}
                      label="Document Type *"
                    >
                      {documentTypes.map(type => (
                        <MenuItem key={type.documentTypeID} value={type.documentTypeID}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors?.documentTypeID && (
                      <Typography variant="caption" color="error">
                        {errors.documentTypeID}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={!!errors?.user_id}>
                    <InputLabel>Resident *</InputLabel>
                    <Select
                      value={currentRequest?.user_id || ''}
                      onChange={(e) => setCurrentRequest({...currentRequest, user_id: e.target.value})}
                      label="Resident *"
                    >
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors?.userID && (
                      <Typography variant="caption" color="error">
                        {errors.userID}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Purpose *"
                    value={currentRequest?.purpose || ''}
                    onChange={(e) => setCurrentRequest({...currentRequest, purpose: e.target.value})}
                    fullWidth
                    margin="normal"
                    error={!!errors?.purpose}
                    helperText={errors?.purpose}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Remarks"
                    value={currentRequest?.remarks || ''}
                    onChange={(e) => setCurrentRequest({...currentRequest, remarks: e.target.value})}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Pickup Option
                </Typography>
                <FormControl component="fieldset" fullWidth margin="normal">
                  <RadioGroup
                    row
                    name="pickupOption"
                    value={currentRequest?.pickupOption || ''}
                    onChange={(e) => setCurrentRequest({ ...currentRequest, pickupOption: e.target.value })}
                  >
                    <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
                    <FormControlLabel value="email" control={<Radio />} label="Email" />
                  </RadioGroup>
                </FormControl>
                    
                    </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resident Information
                  </Typography>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    value={currentRequest?.user?.name || currentRequest?.full_name}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Number"
                    value={currentRequest?.user?.contact_number}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    value={currentRequest?.user?.address}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Verification
                  </Typography>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status *</InputLabel>
                    <Select
                      value={currentRequest?.status || 'Pending'}
                      onChange={(e) => setCurrentRequest({...currentRequest, status: e.target.value})}
                      label="Status *"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Staff Notes"
                    value={currentRequest?.staff_notes || ''}
                    onChange={(e) => setCurrentRequest({...currentRequest, staff_notes: e.target.value})}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    placeholder="Enter verification notes..."
                  />
                </Grid>
                
                {currentRequest?.status === 'Rejected' && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      Please provide clear reasons for rejection that will be shared with the resident.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          
       
          <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
            <Box sx={{ flex: 1 }}>
              {activeStep > 0 && (
                <Button onClick={() => setActiveStep(activeStep - 1)} disabled={readOnly}>
                  Back
                </Button>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Close
              </Button>
              
              {activeStep < 2 && (
                <Button 
                  onClick={() => setActiveStep(activeStep + 1)} 
                  variant="contained"
                >
                  Next
                </Button>
              )}
              
              {!readOnly && activeStep === 2 && (
                <Button 
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {currentRequest?.id ? 'Save Changes' : 'Submit Request'}
                </Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </Box>
    </AuthenticatedLayout>
  );
};

export default AdminDocuments;