import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EvacuationSiteManagement from "./EvacuationSiteManagement"; 
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const EvacuationSiteList = () => {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  
  useEffect(() => {
    axios.get("/evacuationSites")
        .then((response) => {
            console.log("Evacuation sites fetched:", response.data);
            setSites(response.data.evacuationSites || []); // ✅ Extract array from object
        })
        .catch((error) => {
            console.error("Error fetching sites:", error);
            setSites([]); // Ensure sites is always an array
        });
}, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      axios.delete(`/api/evacuation-sites/${id}`)
        .then(() => setSites(sites.filter((site) => site.id !== id)))
        .catch((error) => console.error("Error deleting site:", error));
    }
  };

  const handleAddSite = (newSite) => {
    axios.post("/evacuationSites", newSite)
        .then((response) => {
            setSites((prevSites) => [...prevSites, response.data]); 
            setOpenModal(false);
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                console.error("Validation Error:", error.response.data.errors);
                alert("Validation error: " + JSON.stringify(error.response.data.errors));
            } else {
                console.error("Error adding site:", error);
            }
        });
  };

  const handleEditSite = (id, updatedSite) => {
    axios.put(`/evacuationSites/${id}`, updatedSite)
        .then((response) => {
            setSites((prevSites) => prevSites.map((site) => (site.id === id ? response.data : site)));
            setSelectedSite(null);
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                console.error("Validation Error:", error.response.data.errors);
                alert("Validation error: " + JSON.stringify(error.response.data.errors));
            } else {
                console.error("Error updating site:", error);
            }
        });
  }

  return (
    <AuthenticatedLayout header="Evacuation Sites">
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>Evacuation Sites</Typography>

      <TextField
        label="Search Site"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Add Evacuation Site
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites && sites.length > 0 ? (
              sites.filter((site) => site.site_name?.toLowerCase().includes(search.toLowerCase())).map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.site_name || "N/A"}</TableCell>
                  <TableCell>{site.location || "N/A"}</TableCell>
                  <TableCell>{site.capacity || "N/A"}</TableCell>
                  <TableCell>{site.status || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(site.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No evacuation sites available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding Evacuation Site */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
     
        <DialogContent>
          <EvacuationSiteManagement onSubmit={handleAddSite} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
    </AuthenticatedLayout>
  );
};

export default EvacuationSiteList;
