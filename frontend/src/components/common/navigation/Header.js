import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, ListItemText, Drawer, List, ListItem, ListItemIcon } from "@mui/material";
import { Home as HomeIcon, AccountCircle as AccountCircleIcon, Menu as MenuIcon, TableChart as TableChartIcon, Link as LinkIcon, People as PeopleIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import untuk media query

const Header = ({ isAuthenticated, handleLogout, name, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false); // State untuk drawer akun di mobile

  const isMobile = useMediaQuery("(max-width:600px)"); // Media query untuk mendeteksi mobile

  const handleMenuOpen = (event) => {
    if (isMobile) {
      setAccountDrawerOpen(true); // Buka drawer jika di mobile
    } else {
      setAnchorEl(event.currentTarget); // Buka menu jika di desktop
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccountDrawerClose = () => {
    setAccountDrawerOpen(false);
  };

  const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          INOVEAZY
        </Typography>
        <List>
          <ListItem button component={Link} to="/explorer">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Explorer" />
          </ListItem>
          <ListItem button component={Link} to="/table">
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Tabel" />
          </ListItem>
          <ListItem button component={Link} to="/links">
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText primary="Link Penting" />
          </ListItem>
          <ListItem button component={Link} to="/user-management">
            <ListItemIcon>
              <PeopleIcon /> {/* Ikon untuk User Management */}
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button onClick={handleMenuOpen}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
        </List>
      </Box>
  );

  return (
      <AppBar position="static" sx={{ backgroundColor: "#282c34" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold", flexGrow: 1 }}>
              INOVEAZY
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              {isAuthenticated && (
                  <>
                    <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/explorer">
                      Explorer
                    </Button>
                    <Button color="inherit" startIcon={<TableChartIcon />} component={Link} to="/table">
                      Tabel
                    </Button>
                    <Button color="inherit" startIcon={<LinkIcon />} component={Link} to="/links">
                      Link Penting
                    </Button>
                    <Button color="inherit" startIcon={<PeopleIcon />} component={Link} to="/user-management">
                      User Management
                    </Button>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <AccountCircleIcon />
                    </IconButton>
                  </>
              )}
            </Box>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
        <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
        >
          {drawer}
        </Drawer>

        {/* Drawer untuk menampilkan info akun secara full page di mobile */}
        <Drawer anchor="bottom" open={accountDrawerOpen} onClose={handleAccountDrawerClose} sx={{ display: { xs: "block", md: "none" } }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Typography variant="body1">Nama: {name}</Typography>
            <Typography variant="body1">Role: {role}</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleLogout();
                  handleAccountDrawerClose();
                }}
                fullWidth
                sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* Menu untuk desktop */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
        >
          <MenuItem component={Link} to="/user-management">
            <ListItemText primary="User Management" />
          </MenuItem>
          <MenuItem>
            <ListItemText primary={`Nama: ${name}`} />
          </MenuItem>
          <MenuItem>
            <ListItemText primary={`Role: ${role}`} />
          </MenuItem>
          <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
          >
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </AppBar>
  );
};

export default Header;
