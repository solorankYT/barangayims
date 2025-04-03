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
  Grid,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Badge,
  Paper,
  Collapse,
  styled
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
  Notifications as NotificationsIcon,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.5, 0)
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
}));

const Footer = styled('footer')(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3, 0),
  marginTop: 'auto'
}));

export default function GuestLayout({ children }) {
  const { auth } = usePage().props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsEl, setNotificationsEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMoreMenuOpen, setMobileMoreMenuOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock notifications data
  const notifications = [
    { id: 1, text: 'Your document request has been approved', time: '2 hours ago' },
    { id: 2, text: 'New community announcement', time: '1 day ago' },
    { id: 3, text: 'Upcoming barangay meeting', time: '3 days ago' }
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsEl(null);
  };

  const handleLogout = () => {
    Inertia.post(route("logout"));
    handleMenuClose();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleMobileMoreMenu = () => {
    setMobileMoreMenuOpen(!mobileMoreMenuOpen);
  };

  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "About", href: "#about", icon: <InfoIcon /> },
    { label: "Services", href: "#services", icon: <ServicesIcon /> },
    { label: "Contact", href: "#contact", icon: <ContactsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
                  alt="Barangay Logo"
                  style={{ width: 50, height: 50, marginRight: 8 }}
                />
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Barangay XYZ
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={Link}
                    href={item.href}
                    sx={{ 
                      mx: 0.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {auth.user ? (
                <>
                  <Menu
                    anchorEl={notificationsEl}
                    open={Boolean(notificationsEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        width: 350,
                        maxHeight: 400,
                        overflow: 'auto'
                      }
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
                      Notifications
                    </Typography>
                    <Divider />
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <MenuItem key={notification.id} onClick={handleMenuClose}>
                          <ListItemText
                            primary={notification.text}
                            secondary={notification.time}
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
                        No new notifications
                      </Typography>
                    )}
                  </Menu>

                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText
                      }}
                    >
                      {auth.user.name.charAt(0)}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Typography variant="subtitle2">
                        {auth.user.name}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      component={Link} 
                      href={route('requeststatus')} 
                      onClick={handleMenuClose}
                    >
                      <ListItemIcon>
                        <DocumentScanner fontSize="small" />
                      </ListItemIcon>
                      Request Status
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    component={Link}
                    href={route('login')}
                    size="small"
                    sx={{ 
                      px: 2,
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href={route('register')}
                    size="small"
                    sx={{ 
                      px: 2,
                      ml: 1,
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Sidebar Drawer */}
      <StyledDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
            alt="Barangay Logo"
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
          <Typography variant="h6">Barangay XYZ</Typography>
        </Box>
        <Divider />
        
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.href} 
                onClick={toggleDrawer(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        {auth.user ? (
          <>
            <ListItemButton onClick={toggleMobileMoreMenu}>
              <ListItemIcon>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText
                  }}
                >
                  {auth.user.name.charAt(0)}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={auth.user.name} />
              {mobileMoreMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={mobileMoreMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={route('dashboard')} 
                  sx={{ pl: 4 }}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                
                <ListItemButton 
                  component={Link} 
                  href={route('requeststatus')} 
                  sx={{ pl: 4 }}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <DocumentScanner fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Request Status" />
                </ListItemButton>
                
                <ListItemButton 
                  onClick={() => {
                    toggleDrawer(false)();
                    handleLogout();
                  }}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        ) : (
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href={route('login')} 
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href={route('register')} 
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </StyledDrawer>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Footer>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
                  alt="Barangay Logo"
                  style={{ width: 40, height: 40, marginRight: 10 }}
                />
                <Typography variant="h6">Barangay 137</Typography>
              </Box>
              <Typography variant="body2">
                Serving our community with integrity and dedication.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <List dense disablePadding>
                {navItems.map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <Button 
                      component={Link} 
                      href={item.href} 
                      color="inherit"
                      size="small"
                      sx={{ 
                        justifyContent: 'flex-start',
                        px: 0,
                        textTransform: 'none'
                      }}
                    >
                      {item.label}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                <Box component="span" sx={{ fontWeight: 600 }}>Address:</Box> Barangay 137, Caloocan City
              </Typography>
              <Typography variant="body2" paragraph>
                <Box component="span" sx={{ fontWeight: 600 }}>Phone:</Box> (02) 8123-4567
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 600 }}>Email:</Box> barangay137@caloocan.gov.ph
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Barangay 137. All rights reserved.
          </Typography>
        </Container>
      </Footer>
    </Box>
  );
}