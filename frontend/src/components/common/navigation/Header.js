import React, { useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { Home as HomeIcon, AccountCircle as AccountCircleIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header = ({ isAuthenticated, handleLogout, name, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Tabel" />
          </ListItem>
          <ListItem button component={Link} to="/links">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Link Penting" />
          </ListItem>
          <ListItem button onClick={handleMenuOpen}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
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
                    <Button color="inherit" component={Link} to="/table">
                      Tabel
                    </Button>
                    <Button color="inherit" component={Link} to="/links">
                      Link Penting
                    </Button>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <AccountCircleIcon />
                    </IconButton>
                  </>
              )}
            </Box>
            <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: "block", md: "none" } }}
            >
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
      </AppBar>
  );
};

export default Header;
