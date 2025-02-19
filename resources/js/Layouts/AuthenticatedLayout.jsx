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
    CssBaseline
} from "@mui/material";
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";


const handleLogout = () => {
    Inertia.post(route("logout"));
};

const drawerWidth = 260;

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex", bgcolor: "#ffffff" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
                    transition: "width 0.3s",
                    ml: open ? `${drawerWidth}px` : "0px",
                    bgcolor: "#ffffff",
                }}
            >
                <Toolbar>
                    <IconButton  edge="start" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000" }}>
                        {header || "Dashboard"}
                    </Typography>

                    {/* User Menu */}
                    <Button color="inherit" onClick={handleMenuOpen} startIcon={<AccountCircle />} sx={{ color: "#000000" }}>
                        {user.name}
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem component={Link} href={route("profile.edit")}>Profile</MenuItem>
                        <MenuItem component="button" href={route("logout")} method="post">Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    transition: "width 0.3s",
                    "& .MuiDrawer-paper": {
                        width: open ? drawerWidth : 0,
                        overflowX: "hidden",
                        bgcolor: "#fff",
                        boxSizing: "border-box",
                        color: "#000",
                        borderRight: "1px solid #ddd",
                    },
                }}
                open={open}
            >
              <Box sx={{ width: drawerWidth, height: "100vh", display: "flex", flexDirection: "column" }}>
                {/* Drawer Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
                        Welcome Admin
                    </Typography>
                    <IconButton onClick={handleDrawerToggle} sx={{ color: "#000" }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ bgcolor: "#ddd" }} />

                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href={route("dashboard")}>
                            <ListItemIcon sx={{ color: "#000" }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" sx={{ color: "#000" }} />
                        </ListItemButton>
                    </ListItem>

                    
                </List>

                <Divider sx={{ bgcolor: "#ddd", mt: "auto" }} />

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

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    bgcolor: "#fff",
                    color: "#000",
                    transition: "margin-left 0.3s",
                    ml: open ? `${drawerWidth}px` : "0px",
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
