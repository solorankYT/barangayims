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
import { useFormik } from "formik";
import * as Yup from "yup";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing Leaflet marker icons issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center = [14.5995, 120.9842]; // Default: Manila

const EvacuationSiteManagement = ({ onSubmit, initialValues = {} }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const formik = useFormik({
    initialValues: {
      siteName: initialValues.siteName || "",
      location: initialValues.location || "",
      latitude: initialValues.latitude || "",
      longitude: initialValues.longitude || "",
      capacity: initialValues.capacity || "",
      status: initialValues.status || "Active",
      resources: initialValues.resources || {
        food: false,
        water: false,
        medical: false,
        electricity: false,
        internet: false,
        restrooms: false,
        shelter: false,
      },
      contactPerson: initialValues.contactPerson || "",
      contactNumber: initialValues.contactNumber || "",
      additionalNotes: initialValues.additionalNotes || "",
    },
    validationSchema: Yup.object({
      siteName: Yup.string().required("Site Name is required"),
      location: Yup.string().required("Location is required"),
      latitude: Yup.number().required("Please select a location"),
      longitude: Yup.number().required("Please select a location"),
      capacity: Yup.number()
        .required("Capacity is required")
        .positive("Must be positive")
        .integer("Must be a whole number"),
      status: Yup.string().required("Status is required"),
      contactPerson: Yup.string().required("Contact Person is required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]+$/, "Must be numeric")
        .min(10, "Must be at least 10 digits")
        .required("Contact Number is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      setOpenSnackbar(true);
      onSubmit(values);
    },
  });

  // Function to handle location search
  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {initialValues.siteName ? "Edit Evacuation Site" : "Add Evacuation Site"}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Site Name */}
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

          {/* Location Search Bar */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Location"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Grid>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Grid item xs={12}>
              {searchResults.map((place, index) => (
                <Button
                  key={index}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "5px" }}
                  onClick={() => {
                    formik.setFieldValue("location", place.display_name);
                    formik.setFieldValue("latitude", parseFloat(place.lat));
                    formik.setFieldValue("longitude", parseFloat(place.lon));
                    setSearchResults([]); // Clear results after selection
                  }}
                >
                  {place.display_name}
                </Button>
              ))}
            </Grid>
          )}

          {/* Capacity */}
          <Grid item xs={12}>
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

          {/* Resources */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Available Resources</Typography>
            <FormGroup row>
              {["food", "water", "medical", "electricity", "internet", "restrooms", "shelter"].map(
                (resource) => (
                  <FormControlLabel
                    key={resource}
                    control={
                      <Checkbox
                        name={`resources.${resource}`}
                        checked={formik.values.resources[resource]}
                        onChange={(e) =>
                          formik.setFieldValue(`resources.${resource}`, e.target.checked)
                        }
                      />
                    }
                    label={resource.charAt(0).toUpperCase() + resource.slice(1)}
                  />
                )
              )}
            </FormGroup>
          </Grid>

          {/* Contact Person */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* Contact Number */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              name="additionalNotes"
              multiline
              rows={3}
              value={formik.values.additionalNotes}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* Map with Marker */}
          <Grid item xs={12}>
            <MapContainer center={center} zoom={12} style={{ height: "300px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {formik.values.latitude && formik.values.longitude && (
                <Marker position={[formik.values.latitude, formik.values.longitude]} />
              )}
            </MapContainer>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              {initialValues.siteName ? "Update Site" : "Add Site"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EvacuationSiteManagement;
