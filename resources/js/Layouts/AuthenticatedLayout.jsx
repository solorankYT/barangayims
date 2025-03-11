import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Menu,
    MenuItem,
    Button,
    CssBaseline,
    Tooltip
} from "@mui/material";
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    PostAdd,
    Article,
    Report,
    Person,
    AdminPanelSettings,
    VerifiedUser,
    SystemSecurityUpdate,
    Map
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

const drawerWidth = 260;

export default function AuthenticatedLayout({ header , children }) {
    const { user } = usePage().props.auth;
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    Inertia.post(route("logout")); 
    handleMenuClose();
  };

    const navItems = [
        { label: "Dashboard", icon: <DashboardIcon />, route: "dashboard" },
        { label: "Certificate Application", icon: <PostAdd />, route: "admincertificate" },
        { label: "Document and Record", icon: <Article />, route: "AdminDocuments" }, 
        { label: "Incident Reports", icon: <Report />, route: "incidentreport" },
    ];

    const userManagementItems = [
        { label: "Residents Management", icon: <Person />, route: "residentmanagement" },
        { label: "Roles Management", icon: <AdminPanelSettings />, route: "roles" },
        { label: "System Management", icon: <SystemSecurityUpdate />, route: "roles" },
        { label: "Evacuation Site Management", icon: <Map />, route: "evacucationsitelist" },
    ];

    return (
        <Box sx={{ display: "flex", bgcolor: "#ffffff" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
                    ml: { sm: drawerOpen ? `${drawerWidth}px` : "0px" },
                    bgcolor: "#ffffff",
                    transition: "width 0.3s",
                }}
            >
                <Toolbar>
                    <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000" }}>
                        {header}
                    </Typography>

                    <Tooltip title="Account Settings">
                        <Button
                            onClick={handleMenuOpen}
                            startIcon={<AccountCircle />}
                            sx={{ color: "#000000", textTransform: "none" }}
                        >
                            {user.name}
                        </Button>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem component={Link} href={route("profile.edit")}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: { sm: drawerOpen ? drawerWidth : 0 },
                    flexShrink: 0,
                    transition: "width 0.3s",
                    "& .MuiDrawer-paper": {
                        width: drawerOpen ? drawerWidth : 0,
                        overflowX: "hidden",
                        bgcolor: "#fff",
                        boxSizing: "border-box",
                        borderRight: "1px solid #ddd",
                    },
                }}
                open={drawerOpen}
            >
                <Box sx={{ width: drawerWidth, height: "100vh", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
                            Barangay IMS
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: "#ddd" }} />

                    <List>
                        {navItems.map((item) => (
                            <ListItem disablePadding key={item.label}>
                                <ListItemButton component={Link} href={route(item.route)}>
                                    <ListItemIcon sx={{ color: "#000" }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} sx={{ color: "#000" }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ bgcolor: "#ddd", my: 1 }} />

                    <Typography variant="subtitle2" sx={{ p: 2, color: "gray", fontWeight: "bold" }}>
                     Management
                    </Typography>
                    <List>
                        {userManagementItems.map((item) => (
                            <ListItem disablePadding key={item.label}>
                                <ListItemButton component={Link} href={route(item.route)}>
                                    <ListItemIcon sx={{ color: "#000" }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} sx={{ color: "#000" }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ bgcolor: "#ddd", my: "auto" }} />

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href={route("profile.edit")}>
                                <ListItemIcon sx={{ color: "#000" }}>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" sx={{ color: "#000" }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon sx={{ color: "#000" }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Log Out" sx={{ color: "#000" }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    bgcolor: "#fff",
                    color: "#000",
                    transition: "margin-left 0.3s",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
