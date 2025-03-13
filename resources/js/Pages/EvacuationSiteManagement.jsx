import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
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
  const [searchResults, setSearchResults] = useState([]);

  const formik = useFormik({
    initialValues: {
      id: initialValues.id || "",
      contact_person: initialValues.contact_person || "",
      contact_number: initialValues.contact_number || "",
      resources: initialValues.resources || {
        food: false,
        water: false,
        medical: false,
        electricity: false,
        internet: false,
        restrooms: false,
        shelter: false,
      },
      status: initialValues.status || "Active",
      capacity: initialValues.capacity || "",
    },
    validationSchema: Yup.object({
      capacity: Yup.number().required("Capacity is required"),
      status: Yup.string().required("Status is required"),
      contact_person: Yup.string().required("Contact Person is required"),
      contact_number: Yup.string().required("Contact Number is required"),
    }),
    onSubmit: (values) => {
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
        {initialValues.site_name ? "Edit Evacuation Site" : "Add Evacuation Site"}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Site Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Site Name"
              name="site_name"
              value={formik.values.site_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.site_name && Boolean(formik.errors.site_name)}
              helperText={formik.touched.site_name && formik.errors.site_name}
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

          {/* Map with Marker */}
          <Grid item xs={12}>
            <MapContainer center={center} zoom={12} style={{ height: "300px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {formik.values.latitude && formik.values.longitude && (
                <Marker position={[formik.values.latitude, formik.values.longitude]} />
              )}
            </MapContainer>
          </Grid>

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
              name="contact_person"
              value={formik.values.contact_person}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* Contact Number */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact_number"
              value={formik.values.contact_number}
              onChange={formik.handleChange}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              {initialValues.site_name ? "Update Site" : "Add Site"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EvacuationSiteManagement;