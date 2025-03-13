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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Contacts as ContactsIcon,
  MiscellaneousServices as ServicesIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  DocumentScanner,
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useTheme } from "@mui/material/styles";

export default function GuestLayout({ children }) {
  const { auth } = usePage().props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect small screens

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

  // Toggle mobile drawer
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Navigation links
  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "About", href: "#about", icon: <InfoIcon /> },
    { label: "Services", href: "#services", icon: <ServicesIcon /> },
    { label: "Contact", href: "#contact", icon: <ContactsIcon /> },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ background: "#ffffff", color: "#000000", padding: "5px 20px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Side: Logo & Mobile Menu Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton onClick={toggleDrawer(true)} edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Link href="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
                alt="Barangay Logo"
                style={{ width: 50, height: 50 }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation (Hidden on Mobile) */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button key={item.label} color="inherit" component={Link} href={item.href} startIcon={item.icon}>
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

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

      {/* Mobile Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={Link} href={item.href} onClick={toggleDrawer(false)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {!auth.user ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={route("login")} onClick={toggleDrawer(false)}>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={route("register")} onClick={toggleDrawer(false)}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={route("dashboard")} onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={route("requeststatus")} onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <DocumentScanner />
                  </ListItemIcon>
                  <ListItemText primary="Request Status" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>

      {/* Page Content */}
      <div style={{ flex: 1 }}>{children}</div>

      {/* Footer */}
      <footer
        style={{
          background: "#1976d2",
          color: "white",
          textAlign: "center",
          padding: "10px 0",
          marginTop: "auto",
        }}
      >
        <Container>
          <Typography variant="body2">© 2025 Barangay 137. All rights reserved.</Typography>
        </Container>
      </footer>
    </div>
  );
}
