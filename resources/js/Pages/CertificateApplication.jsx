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
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";

const CertificateApplication = ({ open, handleClose }) => {
  const { auth } = usePage().props; // Get authenticated user data

  const [formData, setFormData] = useState({
    resident_id: auth.user.id, // Pre-fill resident ID
    full_name: auth.user.name, // Pre-fill resident name
    date_of_birth: "",
    sex: "",
    civil_status: "",
    contact_number: "",
    email: auth.user.email || "",
    address: "",
    years_of_residency: "",
    valid_id_type: "",
    valid_id_file: null,
    certificate_type: "",
    purpose: "",
    employer_school_agency: "",
    supporting_document: null, // File upload
    business_name: "",
    business_address: "",
    business_nature: "",
    business_owner: "",
    business_registration_number: "",
    business_documents: null,
    agree_terms: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, agree_terms: e.target.checked });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    router.post("/certificate-application", formDataToSend, {
      onSuccess: () => handleClose(),
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Apply for a Barangay Certificate</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Resident Information */}
          <Grid item xs={12}>
            <Typography variant="h6">Resident Information</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Full Name" fullWidth value={formData.full_name} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select name="sex" value={formData.sex} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
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
            <TextField name="contact_number" label="Contact Number" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField name="email" label="Email Address" fullWidth value={formData.email} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField name="address" label="Complete Address" fullWidth onChange={handleChange} />
          </Grid>

          {/* Certificate Application */}
          <Grid item xs={12}>
            <Typography variant="h6">Certificate Application</Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Certificate Type</InputLabel>
              <Select name="certificate_type" value={formData.certificate_type} onChange={handleChange}>
                <MenuItem value="Barangay Clearance">Barangay Clearance</MenuItem>
                <MenuItem value="Certificate of Indigency">Certificate of Indigency</MenuItem>
                <MenuItem value="First-Time Job Seeker Certificate">First-Time Job Seeker Certificate</MenuItem>
                <MenuItem value="Barangay Business Permit">Barangay Business Permit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField name="purpose" label="Purpose of Application" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="employer_school_agency" label="Employer/School/Agency (if applicable)" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <input type="file" name="supporting_document" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
          </Grid>

          {/* Business Information (Only if Business Permit) */}
          {formData.certificate_type === "Barangay Business Permit" && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">Business Information</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField name="business_name" label="Business Name" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="business_owner" label="Business Owner" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="business_address" label="Business Address" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="business_nature" label="Nature of Business" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField name="business_registration_number" label="Business Registration Number" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <input type="file" name="business_documents" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
              </Grid>
            </>
          )}

          {/* Consent and Agreement */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={formData.agree_terms} onChange={handleCheckboxChange} />}
              label="I hereby declare that the information provided is true and correct to the best of my knowledge."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!formData.agree_terms}>
          Submit Application
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateApplication;
