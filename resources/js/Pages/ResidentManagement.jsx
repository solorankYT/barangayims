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
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const ResidentManagement = () => {
  const { residents } = usePage().props; 
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [residentData, setResidentData] = useState({
    id: "",
    name: "",
    birthday: "",
    gender: "",
    email: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    household_number: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = (resident = null) => {
    setIsEditing(!!resident);
    setResidentData(
      resident
        ? {
          id: resident.id,
          name: resident.name,
          birthday: resident.birthday ? resident.birthday.split("T")[0] : "",
          gender: resident.gender,
          email: resident.email,
          contact_number: resident.contact_number,
          address: resident.address,
          city: resident.city,
          state: resident.state,
          zip_code: resident.zip_code,
          household_number: resident.household_number,
          password: "", 
        }
        : {
          id: "",
          name: "",
          birthday: "",
          gender: "",
          email: "",
          contact_number: "",
          address: "",
          city: "",
          state: "",
          zip_code: "",
          household_number: "",
          password: "",
        }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResidentData({
      id: "",
      name: "",
      birthday: "",
      gender: "",
      email: "",
      contact_number: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      household_number: "",
      password: "",
    });
  };

  const handleSave = () => {
    const formattedData = {
      ...residentData,
      birthday: residentData.birthday ? residentData.birthday.split("T")[0] : "",
    };

    if (!isEditing && !formattedData.password) {
      alert("Password is required for new residents.");
      return;
    }

    if (isEditing) {
      delete formattedData.password; 
      router.put(`/residentmanagement/${residentData.id}`, formattedData, {
        onSuccess: () => handleClose(),
      });
    } else {
      router.post("/residentmanagement", formattedData, {
        onSuccess: () => handleClose(),
      });
    }
  };
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      router.delete(`/residentmanagement/${id}`);
    }
  };

  const filteredResidents = residents.filter((resident) => 
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.contact_number.includes(searchTerm)
  );

  return (
    <AuthenticatedLayout header="Resident Management">
      <Box sx={{ width: "100%", padding: 3 }}>

      <TextField
          variant="outlined"
          placeholder="Search by Name, Email, or Contact"
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

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Resident
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Birthday</b></TableCell>
                <TableCell><b>Gender</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Contact</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>City</b></TableCell>
                <TableCell><b>State</b></TableCell>
                <TableCell><b>Zip Code</b></TableCell>
                <TableCell><b>Household #</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResidents.length > 0 ? (
                filteredResidents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell>{resident.id}</TableCell>
                    <TableCell>{resident.name}</TableCell>
                    <TableCell>{resident.birthday}</TableCell>
                    <TableCell>{resident.gender}</TableCell>
                    <TableCell>{resident.email}</TableCell>
                    <TableCell>{resident.contact_number}</TableCell>
                    <TableCell>{resident.address}</TableCell>
                    <TableCell>{resident.city}</TableCell>
                    <TableCell>{resident.state}</TableCell>
                    <TableCell>{resident.zip_code}</TableCell>
                    <TableCell>{resident.household_number}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(resident)} color="primary">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No residents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Resident" : "Add Resident"}</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Personal Information</Typography>
            <TextField label="Name" name="name" fullWidth margin="dense" value={residentData.name} onChange={(e) => setResidentData({ ...residentData, name: e.target.value })} />
            <TextField label="Birthday" name="birthday" type="date" fullWidth margin="dense" value={residentData.birthday} onChange={(e) => setResidentData({ ...residentData, birthday: e.target.value })} />
            <Select
              fullWidth
              displayEmpty
              value={residentData.gender}
              onChange={(e) => setResidentData({ ...residentData, gender: e.target.value })}
              sx={{ mt: 1 }}
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            <TextField label="Contact Number" name="contact_number" fullWidth margin="dense" value={residentData.contact_number} onChange={(e) => setResidentData({ ...residentData, contact_number: e.target.value })} />
           <Typography variant="h6">Address Information</Typography>
            <TextField label="Address" name="address" fullWidth margin="dense" value={residentData.address} onChange={(e) => setResidentData({ ...residentData, address: e.target.value })} />
            <TextField label="City" name="city" fullWidth margin="dense" value={residentData.city} onChange={(e) => setResidentData({ ...residentData, city: e.target.value })} />
            <TextField label="State" name="state" fullWidth margin="dense" value={residentData.state} onChange={(e) => setResidentData({ ...residentData, state: e.target.value })} />
            <TextField label="Zip Code" name="zip_code" fullWidth margin="dense" value={residentData.zip_code} onChange={(e) => setResidentData({ ...residentData, zip_code: e.target.value })} />
            <TextField label="Household Number" name="household_number" fullWidth margin="dense" value={residentData.household_number} onChange={(e) => setResidentData({ ...residentData, household_number: e.target.value })} />
           <Typography variant="h6">Account Information</Typography>
            <TextField label="Email" name="email" type="email" fullWidth margin="dense" value={residentData.email} onChange={(e) => setResidentData({ ...residentData, email: e.target.value })} />
            {!isEditing && (
              <TextField label="Password" name="password" type="password" fullWidth margin="dense" value={residentData.password} onChange={(e) => setResidentData({ ...residentData, password: e.target.value })} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSave} color="primary">{isEditing ? "Update" : "Save"}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AuthenticatedLayout>
  );
};

export default ResidentManagement;
