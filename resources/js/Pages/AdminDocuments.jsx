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
import { Autocomplete } from "@mui/lab";
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
    status: "",
    purpose: "",
    remarks: "",
  });

  const handleOpen = (document = null) => {
    setIsEditing(!!document);
    setDocumentData(
      document
        ? { ...document }
        : { documentRequestID: null, userID: null, documentTypeID: null, status: "", purpose: "", remarks: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDocumentData({ documentRequestID: null, userID: null, documentTypeID: null, status: "", purpose: "", remarks: "" });
  };

  const handleSave = () => {
    if (!documentData.userID || !documentData.documentTypeID) {
      alert("User and Document Type are required.");
      return;
    }

    if (isEditing) {
      router.put(`/AdminDocuments/${documentData.documentRequestID}`, documentData, { onSuccess: handleClose });
    } else {
      router.post("/AdminDocuments", documentData, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this document request?")) {
      router.delete(`/AdminDocuments/${id}`);
    }
  };

  const filteredDocuments = documentRequests.filter((doc) =>
    [doc.documentRequestID.toString(), doc.user?.name, doc.document_type?.name, doc.status, doc.purpose, doc.remarks]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
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

        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add New Request
        </Button>

        {/* Document Requests Table */}
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

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? "Edit Document Request" : "New Document Request"}</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.name || ""}
              value={users.find((user) => user.id === documentData.userID) || null}
              onChange={(event, newValue) => setDocumentData({ ...documentData, userID: newValue ? newValue.id : null })}
              renderInput={(params) => <TextField {...params} label="User" fullWidth margin="dense" />}
            />

            <TextField
              select
              label="Document Type"
              fullWidth
              margin="dense"
              name="documentTypeID"
              value={documentData.documentTypeID}
              onChange={(e) => setDocumentData({ ...documentData, documentTypeID: e.target.value })}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>

            {isEditing && (
              <TextField
                select
                label="Status"
                fullWidth
                margin="dense"
                name="status"
                value={documentData.status}
                onChange={(e) => setDocumentData({ ...documentData, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            )}

            <TextField
              label="Purpose"
              fullWidth
              margin="dense"
              name="purpose"
              value={documentData.purpose}
              onChange={(e) => setDocumentData({ ...documentData, purpose: e.target.value })}
            />

            <TextField
              label="Remarks"
              fullWidth
              margin="dense"
              name="remarks"
              value={documentData.remarks}
              onChange={(e) => setDocumentData({ ...documentData, remarks: e.target.value })}
            />
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
