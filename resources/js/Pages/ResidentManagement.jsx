import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const ResidentManagement = () => {
  const [residents, setResidents] = useState([
    { id: 1, name: "Juan Dela Cruz", age: 30, address: "Brgy 137" },
    { id: 2, name: "Maria Santos", age: 25, address: "Brgy 24" },
    { id: 3, name: "Pedro Gonzales", age: 40, address: "Brgy 58" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({ name: "", age: "", address: "" });

  // Open Modal for Add or Edit
  const handleOpenModal = (resident = null) => {
    if (resident) {
      setEditingResident(resident);
      setFormData(resident);
    } else {
      setEditingResident(null);
      setFormData({ name: "", age: "", address: "" });
    }
    setModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Add or Update Resident
  const handleSave = () => {
    if (!formData.name || !formData.age || !formData.address) return;

    if (editingResident) {
      setResidents(
        residents.map((res) =>
          res.id === editingResident.id ? { ...editingResident, ...formData } : res
        )
      );
    } else {
      const id = residents.length ? residents[residents.length - 1].id + 1 : 1;
      setResidents([...residents, { id, ...formData }]);
    }

    handleCloseModal();
  };

  // Handle Delete Resident
  const handleDelete = (id) => {
    setResidents(residents.filter((resident) => resident.id !== id));
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter Residents Based on Search Term
  const filteredResidents = residents.filter((resident) =>
    Object.values(resident).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "address", headerName: "Address", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpenModal(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AuthenticatedLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Resident Management
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label="Search Resident"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Add Resident
        </Button>
      </Box>

      {/* Residents Table */}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredResidents}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </Box>

      {/* Modal for Add/Edit Resident */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingResident ? "Edit Resident" : "Add Resident"}
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            fullWidth
            value={formData.age}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={formData.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              {editingResident ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
    </AuthenticatedLayout>
  );
};

export default ResidentManagement;
