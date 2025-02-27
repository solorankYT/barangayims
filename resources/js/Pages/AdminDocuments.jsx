import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const AdminDocuments = () => {
  const { documentRequests, documentTypes, users } = usePage().props;
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    userID: "",
    documentTypeID: "",
    status: "",
    purpose: "",
    remarks: "",
  });

  useEffect(() => {
    if (editingRow) {
      setFormData({
        userID: editingRow.userID,
        documentTypeID: editingRow.documentTypeID,
        status: editingRow.status,
        purpose: editingRow.purpose,
        remarks: editingRow.remarks,
      });
    } else {
      setFormData({
        userID: "",
        documentTypeID: "",
        status: "",
        purpose: "",
        remarks: "",
      });
    }
  }, [editingRow]);

  const handleOpen = (row = null) => {
    setEditingRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingRow) {
      Inertia.put(`/admin/document-requests/${editingRow.documentRequestID}`, formData);
    } else {
      Inertia.post("/admin/document-requests", formData);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this document request?")) {
      Inertia.delete(`/admin/document-requests/${id}`);
    }
  };

  const columns = [
    { field: "documentRequestID", headerName: "ID", width: 80 },
    {
      field: "userID",
      headerName: "User",
      width: 180,
      valueGetter: (params) => {
        const user = users.find((u) => u.id === params.row.userID);
        return user ? `${user.name}` : "Unknown";
      },
    },
    {
      field: "documentTypeID",
      headerName: "Document Type",
      width: 200,
      valueGetter: (params) => {
        const docType = documentTypes.find((d) => d.documentTypeID === params.row.documentTypeID);
        return docType ? docType.name : "Unknown";
      },
    },
    { field: "status", headerName: "Status", width: 120 },
    { field: "purpose", headerName: "Purpose", width: 250 },
    { field: "remarks", headerName: "Remarks", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpen(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row.documentRequestID)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
      >
        Add New Request
      </Button>
      <DataGrid rows={documentRequests} columns={columns} getRowId={(row) => row.documentRequestID} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingRow ? "Edit Document Request" : "New Document Request"}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            name="userID"
            label="User"
            value={formData.userID}
            onChange={handleChange}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="dense"
            name="documentTypeID"
            label="Document Type"
            value={formData.documentTypeID}
            onChange={handleChange}
          >
            {documentTypes.map((docType) => (
              <MenuItem key={docType.documentTypeID} value={docType.documentTypeID}>
                {docType.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="purpose"
            label="Purpose"
            value={formData.purpose}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            name="remarks"
            label="Remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingRow ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDocuments;