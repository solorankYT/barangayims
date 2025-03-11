import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { useFormik } from "formik"; // ✅ Correct import
import * as Yup from "yup";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout"; // ✅ Added missing import

const EvacuationSiteManagement = ({ onSubmit, initialValues = {} }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      siteName: initialValues.siteName || "",
      location: initialValues.location || "",
      capacity: initialValues.capacity || "",
      status: initialValues.status || "Active",
      resources: initialValues.resources || {
        food: false,
        water: false,
        medical: false,
        electricity: false,
      },
      contactPerson: initialValues.contactPerson || "",
      contactNumber: initialValues.contactNumber || "",
    },
    validationSchema: Yup.object({
      siteName: Yup.string().required("Site Name is required"),
      location: Yup.string().required("Location is required"),
      capacity: Yup.number()
        .required("Capacity is required")
        .positive("Capacity must be positive")
        .integer("Capacity must be a whole number"),
      status: Yup.string().required("Status is required"),
      contactPerson: Yup.string().required("Contact Person is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]+$/, "Contact number must be numeric")
        .min(10, "Must be at least 10 digits")
        .required("Contact Number is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      setOpenSnackbar(true);
      onSubmit(values);
    },
  });

  return (
 
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          {initialValues.siteName ? "Edit Evacuation Site" : "Add Evacuation Site"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={formik.values.siteName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.siteName && Boolean(formik.errors.siteName)}
                helperText={formik.touched.siteName && formik.errors.siteName}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Full">Full</MenuItem>
                  <MenuItem value="Under Repair">Under Repair</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Available Resources</Typography>
              <FormGroup row>
                {["food", "water", "medical", "electricity"].map((resource) => (
                  <FormControlLabel
                    key={resource}
                    control={
                      <Checkbox
                        name={`resources.${resource}`}
                        checked={formik.values.resources[resource]}
                        onChange={(e) =>
                          formik.setFieldValue(`resources.${resource}`, e.target.checked)
                        } // ✅ Fixed Checkbox Handling
                      />
                    }
                    label={resource.charAt(0).toUpperCase() + resource.slice(1)}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contactPerson"
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
                helperText={formik.touched.contactPerson && formik.errors.contactPerson}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
              />
            </Grid>

            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                {initialValues.siteName ? "Update Site" : "Add Site"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="Evacuation site saved successfully!"
        />
      </Paper>
  
  );
};

export default EvacuationSiteManagement;
