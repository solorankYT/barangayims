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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const AdminDocuments = () => {
  const { documentRequests = [], documentTypes = [], users = [] } = usePage().props;
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentData, setDocumentData] = useState({
    documentRequestID: null,
    userID: null,
    documentTypeID: null,
    status: "Pending", // Default status as per backend logic
    purpose: "",
    remarks: "",
    documentID: null, // Always null for new requests
  });

  const handleOpen = (document = null) => {
    setIsEditing(!!document);
    setDocumentData(
      document
        ? { ...document }
        : { documentRequestID: null, userID: null, documentTypeID: null, status: "Pending", purpose: "", remarks: "", documentID: null }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDocumentData({ documentRequestID: null, userID: null, documentTypeID: null, status: "Pending", purpose: "", remarks: "", documentID: null });
  };

  const handleSave = () => {
    if (!documentData.userID || !documentData.documentTypeID || !documentData.purpose) {
      alert("User, Document Type, and Purpose are required.");
      return;
    }

    const dataToSubmit = {
      userID: documentData.userID,
      documentTypeID: documentData.documentTypeID,
      purpose: documentData.purpose,
      remarks: documentData.remarks,
      documentID: null, // Backend expects null
      status: isEditing ? documentData.status : "Pending", // Default status when creating a new request
    };

    if (isEditing) {
      router.put(`/AdminDocuments/${documentData.documentRequestID}`, dataToSubmit, { onSuccess: () => handleClose() });
    } else {
      router.post("/AdminDocuments", dataToSubmit, { onSuccess: () => handleClose() });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this document request?")) {
      router.delete(`/AdminDocuments/${id}`, { onSuccess: () => setOpen(false) });
    }
  };

  // Filtered document requests based on search term
  const filteredDocuments = documentRequests.filter((doc) =>
    doc.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout header="Document and Record">
      <Box sx={{ width: "100%", padding: 3 }}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search..."
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
          Add New Request
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Document Type</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Purpose</b></TableCell>
                <TableCell><b>Remarks</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.documentRequestID}>
                    <TableCell>{doc.documentRequestID}</TableCell>
                    <TableCell>{doc.user?.name || "Unknown User"}</TableCell>
                    <TableCell>{doc.document_type?.name || "Unknown Document Type"}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.purpose}</TableCell>
                    <TableCell>{doc.remarks}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(doc)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(doc.documentRequestID)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No document requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Document Request Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Document Request" : "New Document Request"}</DialogTitle>
          <DialogContent>
            {/* User Selection with Autocomplete */}
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.name || ""}
              value={users.find((user) => user.id === documentData.userID) || null}
              onChange={(event, newValue) => {
                setDocumentData((prev) => ({ ...prev, userID: newValue ? newValue.id : null }));
              }}
              renderInput={(params) => <TextField {...params} label="User" fullWidth margin="dense" required />}
            />

            {/* Document Type Selection with Autocomplete */}
            <Autocomplete
              options={documentTypes}
              getOptionLabel={(option) => option.name || ""}
              value={documentTypes.find((doc) => doc.documentTypeID === documentData.documentTypeID) || null}
              onChange={(event, newValue) => {
                setDocumentData((prev) => ({ ...prev, documentTypeID: newValue ? newValue.documentTypeID : null }));
              }}
              renderInput={(params) => <TextField {...params} label="Document Type" fullWidth margin="dense" required />}
            />

            <TextField label="Purpose" fullWidth margin="dense" name="purpose" value={documentData.purpose} onChange={(e) => setDocumentData({ ...documentData, purpose: e.target.value })} required />
            <TextField label="Remarks" fullWidth margin="dense" name="remarks" value={documentData.remarks} onChange={(e) => setDocumentData({ ...documentData, remarks: e.target.value })} />
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

export default AdminDocuments;
