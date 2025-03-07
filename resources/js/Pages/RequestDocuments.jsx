import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";

const RequestDocuments = ({ open, handleClose }) => {
  const { auth, documentTypes = [] } = usePage().props;

  const [documentData, setDocumentData] = useState({
    userID: auth?.user?.id || "",
    documentTypeID: null,
    status: "Pending",
    purpose: "",
    remarks: "",
    
  });

  const handleChange = (e) => {
    setDocumentData({ ...documentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!documentData.documentTypeID) {
      alert("Please select a document type.");
      return;
    }
    router.post("/AdminDocuments", documentData, { onSuccess: () => handleClose() });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a Document</DialogTitle>
      <DialogContent>
        <TextField 
          label="User" 
          fullWidth 
          margin="dense" 
          value={auth?.user?.name || "Unknown User"} 
          InputProps={{ readOnly: true }} 
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
            <MenuItem value="Certificate of Indigency">Certificate of Indigency</MenuItem>
            <MenuItem value="Barangay Clearance">Barangay Clearance</MenuItem>
            <MenuItem value="First Time Job Seeker Certificate">First Time Job Seeker Certificate</MenuItem>
            <MenuItem value="Barangay Business Permit">Barangay Business Permit</MenuItem>
            <MenuItem value="Barangay Blotter Report">Barangay Blotter Report</MenuItem>
          </TextField>

        <TextField 
          name="purpose" 
          label="Purpose" 
          fullWidth 
          margin="dense" 
          value={documentData.purpose} 
          onChange={handleChange} 
        />
        
        <TextField 
          name="remarks" 
          label="Remarks" 
          fullWidth 
          margin="dense" 
          value={documentData.remarks} 
          onChange={handleChange} 
        />

        <TextField 
          name="status" 
          label="Status" 
          fullWidth 
          margin="dense" 
          value={documentData.status} 
          InputProps={{ readOnly: true }} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDocuments;
