import React, { useState } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Roles = () => {
  const { roles } = usePage().props;
  const [open, setOpen] = useState(false);
  const [roleData, setRoleData] = useState({ 
    id: "", 
    name: "" 
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = (role = null) => {
    setIsEditing(!!role);
    setRoleData(
      role 
        ? { 
          id: role.id, 
          name: role.name 
        } : { 
            id: "", 
            name: "" 
        });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoleData({ id: "", name: "" });
  };

  const handleSave = () => {
    if (isEditing) {
      router.put(`/roles/${roleData.id}`, { name: roleData.name }, {
        onSuccess: () => handleClose(),
      });
    } else {
      router.post("/roles", { name: roleData.name }, {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      router.delete(`/roles/${id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <Box sx={{ width: "100%", padding: 3 }}>
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Role Name</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(role)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(role.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
