import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel,
  FormControl, FormControlLabel, Checkbox, Grid,
  Typography, Stepper, Step, StepLabel, Alert,
  Divider, FormHelperText, Box, Avatar,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { usePage, router } from '@inertiajs/react';
import { Today, Person, Business, School, Receipt } from '@mui/icons-material';

const CertificateApplication = ({ open, handleClose }) => {
  const { auth } = usePage().props;
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const certificateTypes = [
    { value: 'Barangay Clearance', label: 'Barangay Clearance', icon: <Receipt /> },
    { value: 'Certificate of Indigency', label: 'Certificate of Indigency', icon: <Person /> },
    { value: 'First-Time Job Seeker Certificate', label: 'First-Time Job Seeker', icon: <School /> },
    { value: 'Barangay Business Permit', label: 'Business Permit', icon: <Business /> },
    { value: 'Barangay ID', label: 'Barangay ID', icon: <Today /> }
  ];

  const [formData, setFormData] = useState({
    resident_id: auth.user.id,
    full_name: auth.user.name || '',
    birthday: auth.user.birthday,
    place_of_birth: '',
    sex: '',
    civil_status: '',
    nationality: 'Filipino',
    contact_number: '',
    email: auth.user.email || '',
    address: '',
    certificate_type: '',
    purpose: '',
    supporting_documents: null,
    business_name: '',
    business_address: '',
    business_type: '',
    monthly_income: '',
    source_of_income: '',
    is_first_time_jobseeker: false,
    educational_attainment: '',
    agree_terms: false
  });

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.place_of_birth) newErrors.place_of_birth = 'Place of birth is required';
    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.civil_status) newErrors.civil_status = 'Civil status is required';
    if (!formData.contact_number) newErrors.contact_number = 'Contact number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.certificate_type) newErrors.certificate_type = 'Certificate type is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    if (!formData.agree_terms) newErrors.agree_terms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateStep1()) return;
    setActiveStep(activeStep + 1);
    if (activeStep === 1) handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await router.post('/AdminDocuments', formDataToSend);
      setActiveStep(2);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConditionalFields = () => {
    switch(formData.certificate_type) {
      case 'Barangay Business Permit':
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" /> Business Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Business Name" 
                name="business_name" 
                value={formData.business_name}
                onChange={handleChange}
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Business Address" 
                name="business_address" 
                value={formData.business_address}
                onChange={handleChange}
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Business Type</InputLabel>
                <Select 
                  name="business_type" 
                  value={formData.business_type}
                  onChange={handleChange}
                >
                  {['Retail', 'Food', 'Services', 'Manufacturing'].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'Certificate of Indigency':
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" /> Income Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Monthly Income (PHP)" 
                name="monthly_income" 
                type="number" 
                value={formData.monthly_income}
                onChange={handleChange}
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Source of Income" 
                name="source_of_income" 
                value={formData.source_of_income}
                onChange={handleChange}
                required 
              />
            </Grid>
          </Grid>
        );

      case 'First-Time Job Seeker Certificate':
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School color="primary" /> Education Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="is_first_time_jobseeker" 
                    checked={formData.is_first_time_jobseeker} 
                    onChange={handleChange}
                  />
                }
                label="I certify this is my first time seeking employment"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Educational Attainment" 
                name="educational_attainment" 
                value={formData.educational_attainment}
                onChange={handleChange}
                required 
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Personal Information
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="birthday"
              type="date"  // Standard HTML5 date input
              value={formData.birthday || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}  // Fixes label overlap
              error={!!errors.birthday}
              helperText={errors.birthday}
              required
            />
            </Grid>
            
            
            <Grid item xs={6} md={3}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                >
                  {['Male', 'Female', 'Other'].map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Grid>
            
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Complete Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                error={!!errors.contact_number}
                helperText={errors.contact_number}
                required
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Certificate Details Section */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt /> Certificate Details
              </Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.certificate_type}>
                <InputLabel>Certificate Type</InputLabel>
                <Select
                  name="certificate_type"
                  value={formData.certificate_type}
                  onChange={handleChange}
                >
                  {certificateTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.certificate_type && <FormHelperText>{errors.certificate_type}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                error={!!errors.purpose}
                helperText={errors.purpose}
                required
              />
            </Grid>
            
            {/* Conditional Fields */}
            {formData.certificate_type && renderConditionalFields()}

            {/* Supporting Documents */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Supporting Documents</Typography>
              <Divider />
              <input
                type="file"
                name="supporting_documents"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
                style={{ marginTop: '16px' }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormControl>
                <FormLabel>Delivery option</FormLabel>
                <RadioGroup row>
                    <FormControlLabel value="pick_up" control={<Radio/>} label="Pick-Up"/>
                    <FormControlLabel value="email" control={<Radio/>} label="Email"/>
                  </RadioGroup>
              </FormControl>
            </Grid>
           

            {/* Terms and Conditions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <FormControl error={!!errors.agree_terms}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agree_terms"
                      checked={formData.agree_terms}
                      onChange={handleChange}
                      required
                    />
                  }
                  label="I certify that all information provided is true and correct."
                />
                {errors.agree_terms && <FormHelperText>{errors.agree_terms}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2, mx: 'auto', bgcolor: 'primary.main' }}>
              <Today fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Application Submitted for Review
            </Typography>
            <Typography color="text.secondary">
              Your {formData.certificate_type} application has been received and is being processed.
              You will be notified once your application has been reviewed.
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Alert 
            severity={formData.status === 'approved' ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {formData.status === 'approved'
              ? 'Application approved! You may now download your certificate.'
              : `Application rejected: ${formData.staff_notes}`}
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {formData.certificate_type ? 
            certificateTypes.find(t => t.value === formData.certificate_type)?.icon :
            <Today />
          }
          {activeStep === 0 ? 'Certificate Application' : 
           activeStep === 1 ? 'Application Submitted' : 'Application Status'}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          <Step><StepLabel>Application</StepLabel></Step>
          <Step><StepLabel>Submission</StepLabel></Step>
          <Step><StepLabel>Result</StepLabel></Step>
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        {activeStep === 0 ? (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={!formData.agree_terms || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CertificateApplication;