import React, { useState } from "react";
import { Box, Typography, Container, Button, Snackbar, Alert } from "@mui/material";
import { Report, Description, WorkspacePremium } from "@mui/icons-material";
import GuestLayout from "@/Layouts/GuestLayout";
import FileIncidentReport from "./FileIncidentReport";
import RequestDocuments from "./RequestDocuments";
import CertificateApplication from "./CertificateApplication";
import { Inertia } from "@inertiajs/inertia";

const Welcome = ({ auth }) => {
  const [openIncident, setOpenIncident] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleButtonClick = (setter) => {
    if (!auth.user) {
      Inertia.visit(route("login"));
      setSnackbar({ open: true, message: "You need to log in first to access this feature.", severity: "warning" });
      return;
    }
    setter(true);
  };

  return (
    <GuestLayout auth={auth}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "50vh", md: "70vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://plus.unsplash.com/premium_photo-1722704537052-04209596bf4e?q=80&w=2071&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h3" fontWeight={600} gutterBottom sx={{ textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}>
          Welcome to Barangay 137
        </Typography>
        <Typography variant="h5" sx={{ color: "#FFA725", maxWidth: "600px", textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}>
          Building a Stronger, Safer, and More Connected Community
        </Typography>
      </Box>

      {/* Services Section */}
      <Container id="services" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Services We Offer
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Report />}
            onClick={() => handleButtonClick(setOpenIncident)}
            sx={{
              minWidth: "220px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            File Incident Report
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Description />}
            onClick={() => handleButtonClick(setOpenDocument)}
            sx={{
              minWidth: "220px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Request Document
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<WorkspacePremium />}
            onClick={() => handleButtonClick(setOpenCertificate)}
            sx={{
              minWidth: "220px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            Request Certificate
          </Button>
        </Box>
      </Container>

      {auth.user && (
        <>
          <FileIncidentReport open={openIncident} handleClose={() => setOpenIncident(false)} />
          <RequestDocuments open={openDocument} handleClose={() => setOpenDocument(false)} />
          <CertificateApplication open={openCertificate} handleClose={() => setOpenCertificate(false)} />
        </>
      )}

      {/* Snackbar for Login Alert */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GuestLayout>
  );
};

export default Welcome;
