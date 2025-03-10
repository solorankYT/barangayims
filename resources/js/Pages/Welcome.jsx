import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  FormControl,
  TextField,
  Grid
} from "@mui/material";
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
          height: { xs: "50vh", md: "90vh" },
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
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }} 
          onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}
        >
          Explore Services
        </Button>
      </Box>

      {/* Services Section */}
      <Container id="services" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Services We Offer
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, mt: 3 }}>
          {[
            { title: "File Incident Report", icon: <Report />, color: "secondary", action: setOpenIncident },
            { title: "Request Document", icon: <Description />, color: "success", action: setOpenDocument },
            { title: "Request Certificate", icon: <WorkspacePremium />, color: "primary", action: setOpenCertificate },
          ].map((service, index) => (
            <Card key={index} sx={{ minWidth: 250, transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography variant="h6" fontWeight={600}>{service.title}</Typography>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color={service.color} 
                  onClick={() => handleButtonClick(service.action)}
                >
                  Proceed
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>

         {/* Evacuation Section */}
         <Container id="about" sx={{ py: 6, textAlign: "center" }}>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" fontWeight={600}>Evacuation Site</Typography>
          <Typography variant="body1">
            This Section is for the Evacuation Site of Barangay 137 Caloocan City in case of Emergency. 
          </Typography>
        </Box>
      </Container>


      {/* About Section */}
      <Container id="about" sx={{ py: 6, textAlign: "center" }}>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" fontWeight={600}>About Us</Typography>
          <Typography variant="body1">
            We are committed to building a stronger, safer, and more connected community.
          </Typography>
        </Box>
      </Container>

      {/* Contact Section */}
      <Container id="contact" sx={{ py: 6 }}>
  <Typography variant="h4" fontWeight={600} textAlign="center">
    Contact Us
  </Typography>

  <Grid container spacing={4} sx={{ mt: 4 }}>
    <Grid item xs={12} md={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body1">
          <strong>📍 Address:</strong> Barangay 137, Zone 12, District 1, Caloocan City
        </Typography>
        <Typography variant="body1">
          <strong>📞 Phone:</strong> #09123456789
        </Typography>
        <Typography variant="body1">
          <strong>✉️ Email:</strong> captain@example.com
        </Typography>
      </Box>
    </Grid>

    {/* Contact Form Column */}
    <Grid item xs={12} md={6}>
      <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Send Us a Message
        </Typography>
        <TextField 
          label="Your Name" 
          variant="outlined" 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Your Email" 
          type="email" 
          variant="outlined" 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Your Message" 
          variant="outlined" 
          fullWidth 
          multiline 
          rows={4} 
          sx={{ mb: 2 }} 
        />
        <Button variant="contained" color="primary" fullWidth>
          Send Message
        </Button>
      </Box>
    </Grid>
  </Grid>
</Container>

      {/* Modals for Authenticated Users */}
      {auth.user && (
        <>
          <FileIncidentReport open={openIncident} handleClose={() => setOpenIncident(false)} />
          <RequestDocuments open={openDocument} handleClose={() => setOpenDocument(false)} />
          <CertificateApplication open={openCertificate} handleClose={() => setOpenCertificate(false)} />
        </>
      )}

      {/* Snackbar for Login Alert */}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GuestLayout>
  );
};

export default Welcome;
