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
import { toast } from 'react-toastify';



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
  const [loading, setLoading] = useState(false);
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      setLoading(true);
      try {
        await axios.delete(`/evacuationSites/${id}`);
        setSites(prev => prev.filter(site => site.id !== id));
        toast.success("Site deleted successfully");
      } catch (error) {
        toast.error("Failed to delete site");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      site_name: selectedSite?.site_name || "",
      location: selectedSite?.location || "",
      latitude: selectedSite?.latitude || 14.5995, 
      longitude: selectedSite?.longitude || 120.9842,
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
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const endpoint = isEditing 
          ? `/evacuationSites/${selectedSite.id}`
          : "/evacuationSites";
        const method = isEditing ? 'put' : 'post';
        
        const response = await axios[method](endpoint, {
          ...values,
          resources: JSON.stringify(values.resources) // Match backend expectation
        });
  
        if (isEditing) {
          setSites(prev => prev.map(site => 
            site.id === selectedSite.id ? response.data : site
          ));
        } else {
          setSites(prev => [...prev, response.data]);
        }
        
        toast.success(`Site ${isEditing ? 'updated' : 'added'} successfully`);
        handleClose();
      } catch (error) {
        toast.error(`Failed to ${isEditing ? 'update' : 'add'} site`);
        console.error("Submission error:", error);
      } finally {
        setLoading(false);
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
            countrycodes: "PH",
            viewbox: "116.0,21.0,127.0,4.5",
            bounded: 1, 
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  
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
    
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Evacuation Site
        </Button>

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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
                  {...formik.getFieldProps("status")}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Full">Full</MenuItem>
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
