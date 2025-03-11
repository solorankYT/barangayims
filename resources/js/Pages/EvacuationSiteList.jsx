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
import EvacuationSiteManagement from "./EvacuationSiteManagement"; // Import the form
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const EvacuationSiteList = () => {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios.get("/api/evacuation-sites")
      .then((response) => setSites(response.data))
      .catch((error) => console.error("Error fetching sites:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      axios.delete(`/api/evacuation-sites/${id}`)
        .then(() => setSites(sites.filter((site) => site.id !== id)))
        .catch((error) => console.error("Error deleting site:", error));
    }
  };

  const handleAddSite = (newSite) => {
    axios.post("/api/evacuation-sites", newSite)
      .then((response) => {
        setSites([...sites, response.data]);
        setOpenModal(false);
      })
      .catch((error) => console.error("Error adding site:", error));
  };

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
            {sites.filter((site) => site.siteName.toLowerCase().includes(search.toLowerCase()))
              .map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.siteName}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>{site.capacity}</TableCell>
                  <TableCell>{site.status}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(site.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
