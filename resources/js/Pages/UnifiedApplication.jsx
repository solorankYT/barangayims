import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";

const UnifiedApplication = ({ open, handleClose }) => {
  const { auth } = usePage().props;
  const [applicationMode, setApplicationMode] = useState("detailed"); // 'basic' or 'detailed'

  const [formData, setFormData] = useState({
    // Common fields
    resident_id: auth.user.id,
    full_name: auth.user.name,
    email: auth.user.email || "",
    certificate_type: "",
    purpose: "",
    
    // Detailed fields
    date_of_birth: "",
    sex: "",
    civil_status: "",
    contact_number: "",
    address: "",
    years_of_residency: "",
    valid_id_type: "",
    valid_id_file: null,
    employer_school_agency: "",
    supporting_document: null,
    agree_terms: false,
    
    // Business fields
    business_name: "",
    business_address: "",
    business_nature: "",
    business_owner: "",
    business_registration_number: "",
    business_documents: null,
    
    // Basic fields
    remarks: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    router.post(
      applicationMode === "basic" ? "/document-requests" : "/certificate-application",
      formDataToSend,
      { onSuccess: () => handleClose() }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {applicationMode === "basic" 
          ? "Document Request" 
          : "Certificate Application"}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2}>
          {/* Application Mode Selector */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Application Type</FormLabel>
              <RadioGroup
                row
                value={applicationMode}
                onChange={(e) => setApplicationMode(e.target.value)}
              >
                <FormControlLabel
                  value="basic"
                  control={<Radio />}
                  label="Quick Request"
                />
                <FormControlLabel
                  value="detailed"
                  control={<Radio />}
                  label="Full Application"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Common Fields */}
          <Grid item xs={12}>
            <TextField 
              label="Full Name" 
              fullWidth 
              value={formData.full_name} 
              disabled 
            />
          </Grid>

          <Grid item xs={applicationMode === "basic" ? 12 : 6}>
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                name="certificate_type"
                value={formData.certificate_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="Barangay Clearance">Barangay Clearance</MenuItem>
                <MenuItem value="Certificate of Indigency">Certificate of Indigency</MenuItem>
                <MenuItem value="First-Time Job Seeker Certificate">First-Time Job Seeker Certificate</MenuItem>
                <MenuItem value="Barangay Business Permit">Barangay Business Permit</MenuItem>
                <MenuItem value="Barangay Blotter Report">Barangay Blotter Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {applicationMode === "basic" ? (
            /* Basic Request Fields */
            <>
              <Grid item xs={12}>
                <TextField
                  name="purpose"
                  label="Purpose"
                  fullWidth
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="Additional Remarks"
                  fullWidth
                  value={formData.remarks}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Supporting Document (if required)
                </Typography>
                <input
                  type="file"
                  name="supporting_document"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileChange}
                />
              </Grid>
            </>
          ) : (
            /* Detailed Application Fields */
            <>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Sex</InputLabel>
                  <Select name="sex" value={formData.sex} onChange={handleChange}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Civil Status</InputLabel>
                  <Select name="civil_status" value={formData.civil_status} onChange={handleChange}>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                    <MenuItem value="Separated">Separated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField 
                  name="contact_number" 
                  label="Contact Number" 
                  fullWidth 
                  onChange={handleChange} 
                  required 
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField 
                  name="email" 
                  label="Email" 
                  fullWidth 
                  value={formData.email} 
                  disabled 
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Complete Address"
                  fullWidth
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Application Details */}
              <Grid item xs={12}>
                <Typography variant="h6">Application Details</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="purpose"
                  label="Purpose of Application"
                  fullWidth
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="employer_school_agency"
                  label="Employer/School/Agency (if applicable)"
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Supporting Documents
                </Typography>
                <input
                  type="file"
                  name="supporting_document"
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileChange}
                />
              </Grid>

              {/* Business Information (Conditional) */}
              {formData.certificate_type === "Barangay Business Permit" && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">Business Information</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      name="business_name"
                      label="Business Name"
                      fullWidth
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      name="business_owner"
                      label="Business Owner"
                      fullWidth
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      name="business_address"
                      label="Business Address"
                      fullWidth
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      name="business_nature"
                      label="Nature of Business"
                      fullWidth
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      name="business_registration_number"
                      label="Registration Number"
                      fullWidth
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Business Documents (Permits, etc.)
                    </Typography>
                    <input
                      type="file"
                      name="business_documents"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileChange}
                      multiple
                    />
                  </Grid>
                </>
              )}

              {/* Terms Agreement */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agree_terms"
                      checked={formData.agree_terms}
                      onChange={(e) => 
                        setFormData({...formData, agree_terms: e.target.checked})
                      }
                      required
                    />
                  }
                  label="I certify that all information provided is true and correct."
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={applicationMode === "detailed" && !formData.agree_terms}
        >
          {applicationMode === "basic" ? "Submit Request" : "Submit Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnifiedApplication;