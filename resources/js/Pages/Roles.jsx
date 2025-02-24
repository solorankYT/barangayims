import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [roleData, setRoleData] = useState({ id: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleOpen = (role = null) => {
    setIsEditing(!!role);
    setRoleData(role ? { id: role.id, name: role.name } : { id: "", name: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoleData({ id: "", name: "" });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/roles/${roleData.id}`, { name: roleData.name });
      } else {
        await axios.post("/api/roles", { name: roleData.name });
      }
      fetchRoles();
      handleClose();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`/api/roles/${id}`);
        fetchRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Role Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpen(params.row)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AuthenticatedLayout>
    <Box sx={{ height: 400, width: "100%", padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Role Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Role
      </Button>
      <DataGrid
        rows={roles}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Role Name"
            variant="outlined"
            value={roleData.name}
            onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEditing ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AuthenticatedLayout>
  );
};

export default Roles;
