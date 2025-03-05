import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Contacts as ContactsIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Description,
  Report,
  MiscellaneousServices as ServicesIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import IncidentReportForm from "./FileIncidentReport";
import DocumentRequestForm from "./RequestDocuments";

// Helper function for role-based UI
const getAuthButtons = (auth) => {
  const userRoles = auth?.user?.roles || [];
  const isBarangayOfficial = userRoles.includes("Barangay Captain") || userRoles.includes("Barangay Secretary");
  const isResident = userRoles.includes("Resident");

  if (!auth.user) {
    return (
      <>
        <Button color="inherit" component={Link} href={route("login")} aria-label="Login">
          Login
        </Button>
        <Button color="inherit" component={Link} href={route("register")} aria-label="Register">
          Register
        </Button>
      </>
    );
  }

  return isBarangayOfficial ? (
    <Button color="inherit" component={Link} href={route("dashboard")} startIcon={<DashboardIcon />} aria-label="Go to Dashboard">
      Dashboard
    </Button>
  ) : isResident ? (
    <Button color="inherit" component={Link} href={route("logout")} method="post" as="button" startIcon={<ExitToAppIcon />} aria-label="Logout">
      Logout
    </Button>
  ) : null;
};

const Navbar = ({ auth }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <AppBar position="static" sx={{ background: "#1976d2", padding: "5px 20px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side - Logo and Menu Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
              alt="Barangay Logo"
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open Menu">
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Center - Navigation (Desktop Only) */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} href="/" startIcon={<HomeIcon />} aria-label="Home">
                Home
              </Button>
              <Button color="inherit" component={Link} href="#about" startIcon={<InfoIcon />} aria-label="About Us">
                About
              </Button>
              <Button color="inherit" component={Link} href="#services" startIcon={<ServicesIcon />} aria-label="Services">
                Services
              </Button>
              <Button color="inherit" component={Link} href="#contact" startIcon={<ContactsIcon />} aria-label="Contact">
                Contact
              </Button>
            </Box>
          )}

          {/* Right Side - Authentication */}
          <Box sx={{ display: "flex", gap: 2 }}>{getAuthButtons(auth)}</Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem button component={Link} href="/">
              <HomeIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} href="#about">
              <InfoIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} href="#services">
              <ServicesIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button component={Link} href="#contact">
              <ContactsIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="Contact" />
            </ListItem>
            {getAuthButtons(auth)}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

const Welcome = ({ auth }) => {
  const [openIncident, setOpenIncident] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);

  return (
    <>
      <Navbar auth={auth} />

      {/* Hero Section */}
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1722704537052-04209596bf4e?q=80&w=2071&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          p: 4,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Barangay 137
        </Typography>
        <Typography variant="h5">Building a Stronger, Safer, and More Connected Community</Typography>
      </Box>

      {/* Services Section */}
      <Container id="services" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Services We Offer
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          We provide a variety of services to support our residents.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Button variant="contained" color="secondary" startIcon={<Report />} onClick={() => setOpenIncident(true)}>
            File Incident Report
          </Button>
          <Button variant="contained" color="success" startIcon={<Description />} onClick={() => setOpenDocument(true)}>
            Request Document
          </Button>
        </Box>
      </Container>

      {/* Modals
      <IncidentReportForm open={openIncident} handleClose={() => setOpenIncident(false)} />
      <DocumentRequestForm open={openDocument} handleClose={() => setOpenDocument(false)} /> */}

      {/* About Section */}
      <Container id="about" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          About Barangay 137
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Barangay 137 is a small community in Pasay City known for its strong sense of unity and support. Our local government is committed to ensuring the welfare and development of our residents.
        </Typography>
      </Container>

      {/* Contact Section */}
      <Container id="contact" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
          Reach out to us for any assistance.
        </Typography>
        <Box>
          <Typography><PhoneIcon /> +63 912 345 6789</Typography>
          <Typography><EmailIcon /> barangay137@example.com</Typography>
        </Box>
      </Container>
    </>
  );
};

export default Welcome;
