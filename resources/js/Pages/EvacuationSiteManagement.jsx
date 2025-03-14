import React, { useEffect, useState } from "react";
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
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const EvacuationSiteManagement = () => {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios
      .get("/evacuationSites")
      .then((response) => setSites(response.data.evacuationSites || []))
      .catch((error) => console.error("Error fetching sites:", error));
  }, []);

  const handleOpen = (site = null) => {
    setIsEditing(!!site);
    setSelectedSite(site);
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedSite(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      axios.delete(`/evacuationSites/${id}`).then(() => {
        setSites((prevSites) => prevSites.filter((site) => site.id !== id));
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      site_name: selectedSite?.site_name || "",
      location: selectedSite?.location || "",
      latitude: selectedSite?.latitude || "",
      longitude: selectedSite?.longitude || "",
      capacity: selectedSite?.capacity || "",
      status: selectedSite?.status || "Active",
      contact_person: selectedSite?.contact_person || "",
      contact_number: selectedSite?.contact_number || "",
      link: selectedSite?.link || "",
      resources: selectedSite?.resources || {
        food: false,
        water: false,
        medical: false,
        electricity: false,
        internet: false,
        restrooms: false,
        shelter: false,
      },
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      site_name: Yup.string().required("Site Name is required"),
      location: Yup.string().required("Location is required"),
      capacity: Yup.number().required("Capacity is required"),
      contact_person: Yup.string().required("Contact Person is required"),
      contact_number: Yup.string().required("Contact Number is required"),
      link: Yup.string().required("Link is required"),
    }),
    onSubmit: (values) => {
      if (isEditing) {
        axios.put(`/evacuationSites/${selectedSite.id}`, values).then((response) => {
          setSites((prevSites) =>
            prevSites.map((site) => (site.id === selectedSite.id ? response.data : site))
          );
          handleClose();
        });
      } else {
        axios.post("/evacuationSites", values).then((response) => {
          setSites((prevSites) => [...prevSites, response.data]);
          handleClose();
        });
      }
    },
  });

  const handleSearchLocation = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            format: "json",
            q: query,
            countrycodes: "PH", // Limits results to the Philippines
            viewbox: "116.0,21.0,127.0,4.5", // Philippines bounding box (left, top, right, bottom)
            bounded: 1, // Restrict search inside the bounding box
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  
  // Component for clicking on map to update latitude and longitude
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        formik.setFieldValue("latitude", e.latlng.lat);
        formik.setFieldValue("longitude", e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <AuthenticatedLayout header="Evacuation Site Management">
      <Box sx={{ width: "100%", padding: 3 }}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search by Site Name or Location"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Add Site Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Evacuation Site
        </Button>

        {/* Table of Evacuation Sites */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Site Name</b></TableCell>
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Capacity</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.site_name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>{site.capacity}</TableCell>
                  <TableCell>{site.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(site)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(site.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for Adding/Editing Evacuation Site */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? "Edit Evacuation Site" : "Add Evacuation Site"}</DialogTitle>
          <DialogContent>
            <TextField 
              label="Site Name"  
              fullWidth 
              margin="dense" 
              disabled={isEditing} 
              {...formik.getFieldProps("site_name")} 
            />

            <TextField 
            label="Location"
            disabled={isEditing}
            fullWidth 
            margin="dense" 
            {...formik.getFieldProps("location")} 
            />
            <TextField label="Capacity" type="number" fullWidth margin="dense" {...formik.getFieldProps("capacity")} />
            <TextField label="Contact Person" fullWidth margin="dense" {...formik.getFieldProps("contact_person")} />
            <TextField label="Contact Number" fullWidth margin="dense" {...formik.getFieldProps("contact_number")} />
            
            <Typography variant="subtitle1">Available Resources</Typography>
            <FormGroup row>
              {["food", "water", "medical", "electricity", "internet", "restrooms", "shelter"].map((resource) => (
                <FormControlLabel
                  key={resource}
                  control={
                    <Checkbox
                      checked={formik.values.resources[resource]}
                      onChange={(e) =>
                        formik.setFieldValue(`resources.${resource}`, e.target.checked)
                      }
                    />
                  }
                  label={resource.charAt(0).toUpperCase() + resource.slice(1)}
                />
              ))}

              <TextField
                select
                label="Status"
                fullWidth
                margin="dense"
                name="status"
                value={formik.values.status} // Bind value to Formik state
                onChange={formik.handleChange} // Update state when selected
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Full">Full</MenuItem>
                <MenuItem value="Under Repair">Under Repair</MenuItem>
              </TextField>

              <TextField label="Image link" fullWidth margin="dense" {...formik.getFieldProps("link")} />
           
          
            </FormGroup>


            <TextField
              label="Search Location"
              fullWidth
              margin="dense"
              onChange={(e) => handleSearchLocation(e.target.value)}
            />
            {searchResults.map((place, index) => (
              <Button key={index} fullWidth variant="outlined" onClick={() => {
                formik.setFieldValue("location", place.display_name);
                formik.setFieldValue("latitude", parseFloat(place.lat));
                formik.setFieldValue("longitude", parseFloat(place.lon));
                setSearchResults([]);
              }}>
                {place.display_name}
              </Button>
            ))}


            {/* Map for Selecting Location */}
            <MapContainer center={[formik.values.latitude, formik.values.longitude]} zoom={12} style={{ height: "300px", width: "100%", marginTop: "10px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[formik.values.latitude, formik.values.longitude]} />
              <MapClickHandler />
            </MapContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={formik.handleSubmit} color="primary">
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AuthenticatedLayout>
  );
};

export default EvacuationSiteManagement;
