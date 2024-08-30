import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, ListItemText } from "@mui/material";
import { Home as HomeIcon, AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header = ({ isAuthenticated, handleLogout, name, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#282c34" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            INOVEAZY
          </Typography>
          {isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
