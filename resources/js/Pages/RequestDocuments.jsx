import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { usePage, router } from "@inertiajs/react";

const RequestDocuments = ({ open, handleClose }) => {
  const { auth, documentTypes = [] } = usePage().props; 
  const [documentData, setDocumentData] = useState({
    userID: auth.user.id,
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
        <TextField label="User" fullWidth margin="dense" value={auth.user.name}  />

        <Autocomplete
          options={documentTypes}
          getOptionLabel={(option) => option.name || ""}
          value={documentTypes.find((doc) => doc.documentTypeID === documentData.documentTypeID) || null}
          onChange={(event, newValue) => {
            setDocumentData({ ...documentData, documentTypeID: newValue ? newValue.documentTypeID : null });
          }}
          renderInput={(params) => <TextField {...params} label="Document Type" fullWidth margin="dense" />}
        />

        <TextField name="purpose" label="Purpose" fullWidth margin="dense" onChange={handleChange} />
        <TextField name="remarks" label="Remarks" fullWidth margin="dense" onChange={handleChange} />
        <TextField name="status" label="Status" fullWidth margin="dense" disabled value={documentData.status} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDocuments;
