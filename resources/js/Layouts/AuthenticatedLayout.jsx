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
    Tooltip,
    useMediaQuery,
    SwipeableDrawer
} from "@mui/material";
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    PostAdd,
    Article,
    Report,
    Person,
    AdminPanelSettings,
    SystemSecurityUpdate,
    Map,
    Cloud
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { router } from '@inertiajs/react';

const drawerWidth = 260;

const handleLogout = () => {
    router.post(route('logout'), {}, {
        preserveState: false,  // Ensures a clean session reset
        onSuccess: () => {
            router.visit(route('login')); // ✅ Redirects to login after logout
        }
    });
};

export default function AuthenticatedLayout({ header, children }) {
    const { user } = usePage().props.auth;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery("(max-width: 900px)");

    const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);



    const navItems = [
        { label: "Dashboard", icon: <DashboardIcon />, route: "dashboard" },
        { label: "E-Services", icon: <Article />, route: "AdminDocuments" },
        { label: "Incident Reports", icon: <Report />, route: "incidentreport" },
    ];

    const userManagementItems = [
        { label: "Residents Management", icon: <Person />, route: "residentmanagement" },
        { label: "Roles Management", icon: <AdminPanelSettings />, route: "roles" },
        { label: "Weather Management", icon: <Cloud />, route: "WeatherManagement" },
        { label: "Evacuation Site Management", icon: <Map />, route: "evacuationsitemanagement" },
    ];

    return (
        <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
            <CssBaseline />
            
            {/* Top App Bar */}
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
                    ml: isMobile ? 0 : `${drawerWidth}px`,
                    bgcolor: "#ffffff",
                    transition: "width 0.3s ease",
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1, color: "#000" }}>
                        {header}
                    </Typography>

                    {/* Account Menu */}
                    <Tooltip title="Account Settings">
                        <Button
                            onClick={handleMenuOpen}
                            startIcon={<AccountCircle />}
                            sx={{ color: "#000", textTransform: "none" }}
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

            {/* Sidebar Drawer */}
            {isMobile ? (
                <SwipeableDrawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    onOpen={handleDrawerToggle}
                    sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
                >
                    <SidebarContent onClose={handleDrawerToggle} navItems={navItems} userManagementItems={userManagementItems} />
                </SwipeableDrawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: "#ffffff",
                            boxSizing: "border-box",
                            borderRight: "1px solid #ddd",
                            overflowX: "hidden", 
                            overflowY: "auto", 
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        },
                    }}
                >
                    <SidebarContent navItems={navItems} userManagementItems={userManagementItems} />
                </Drawer>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    mt: 8,
                    bgcolor: "#fff",
                    color: "#000",
                    transition: "margin-left 0.3s ease",
                    overflowX: "hidden", 
                    overflowY: "auto", 
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

function SidebarContent({ navItems, userManagementItems, onClose }) {
    return (
        <Box sx={{ width: drawerWidth, height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: "bold", 
                            color: "#000",
                            '&:hover': {
                                cursor: 'pointer',
                                // Optional: Add hover effect
                                color: '#555',
                            }
                        }}
                    >
                        Barangay IMS
                    </Typography>
                </Link>
                {onClose && (
                    <IconButton onClick={onClose}>
                        <MenuIcon />
                    </IconButton>
                )}
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
    );
}
