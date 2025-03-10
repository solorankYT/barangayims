import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Info as InfoIcon,
  Contacts as ContactsIcon,
  MiscellaneousServices as ServicesIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  RequestPage,
  DocumentScanner,
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia"; 


export default function GuestLayout({ children }) {
  const { auth } = usePage().props; 
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle User Profile dropdown
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Inertia.post(route("logout")); 
    handleMenuClose();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ background: "#ffffff", color: '#000000', padding: "5px 20px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
                alt="Barangay Logo"
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
            </Link>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} href="/" startIcon={<HomeIcon />}>
              Home
            </Button>
            <Button color="inherit" component={Link} href="#about" startIcon={<InfoIcon />}>
              About
            </Button>
            <Button color="inherit" component={Link} href="#services" startIcon={<ServicesIcon />}>
              Services
            </Button>
            <Button color="inherit" component={Link} href="#contact" startIcon={<ContactsIcon />}>
              Contact
            </Button>
          </Box>

          {/* Authentication/User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!auth.user ? (
              <>
                <Button color="inherit" component={Link} href={route("login")}>
                  Login
                </Button>
                <Button color="inherit" component={Link} href={route("register")}>
                  Register
                </Button>
              </>
            ) : (
              <>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>{auth.user.name.charAt(0)}</Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem component={Link} href={route("dashboard")} onClick={handleMenuClose}>
                    <DashboardIcon sx={{ marginRight: 1 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem component={Link} href={route("requeststatus")} onClick={handleMenuClose}>
                    <DocumentScanner sx={{ marginRight: 1 }} />
                    Request Status
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon sx={{ marginRight: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>


      <div style={{ flex: 1 }}>{children}</div>

  
      <footer style={{ background: "#1976d2", color: "white", textAlign: "center", padding: "10px 0", marginTop: "auto" }}>
        <Container>
          <Typography variant="body2">© 2025 Barangay 137. All rights reserved.</Typography>
        </Container>
      </footer>
    </div>
  );
}
