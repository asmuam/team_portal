import React, { useState, useContext } from "react";
import { AppBar, Container, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, ListItemText, Drawer, List, ListItem, ListItemIcon } from "@mui/material";
import { Home as HomeIcon, AccountCircle as AccountCircleIcon, Menu as MenuIcon, TableChart as TableChartIcon, Link as LinkIcon, People as PeopleIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AuthContext from "../../../context/AuthContext.js";

const Header = ({ isAuthenticated, handleLogout, name, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const { auth } = useContext(AuthContext);

  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();

  const handleMenuOpen = (event) => {
    if (isMobile) {
      setAccountDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
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

  const handleMenuItemClick = (menu) => {
    setActiveMenu(menu);
    handleMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        INOVEAZY
      </Typography>
      <List>
        <ListItem
          button
          component={Link}
          to="/explorer"
          onClick={() => setActiveMenu("explorer")}
          sx={{
            backgroundColor: activeMenu === "explorer" ? "#50575d" : "inherit",
            "&:hover": { backgroundColor: "#6a737d" },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Explorer" />
        </ListItem>
        {/* Tampilkan menu ini untuk semua user kecuali user management */}
        <ListItem
          button
          component={Link}
          to="/table"
          onClick={() => setActiveMenu("table")}
          sx={{
            backgroundColor: activeMenu === "table" ? "#50575d" : "inherit",
            "&:hover": { backgroundColor: "#6a737d" },
          }}
        >
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="Tabel" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/links"
          onClick={() => setActiveMenu("links")}
          sx={{
            backgroundColor: activeMenu === "links" ? "#50575d" : "inherit",
            "&:hover": { backgroundColor: "#6a737d" },
          }}
        >
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText primary="Link Penting" />
        </ListItem>
        {/* Menu User Management hanya muncul untuk Admin */}
        {auth.role === "admin" && (
          <ListItem
            button
            component={Link}
            to="/user-management"
            onClick={() => setActiveMenu("user-management")}
            sx={{
              backgroundColor: activeMenu === "user-management" ? "#50575d" : "inherit",
              "&:hover": { backgroundColor: "#6a737d" },
            }}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        )}
        <ListItem
          button
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: anchorEl ? "#50575d" : "inherit",
            "&:hover": { backgroundColor: "#6a737d" },
          }}
        >
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
                <Button
                  color="inherit"
                  startIcon={<HomeIcon />}
                  component={Link}
                  to="/explorer"
                  sx={{
                    backgroundColor: location.pathname === "/explorer" ? "#50575d" : "inherit",
                    "&:hover": { backgroundColor: "#6a737d" },
                  }}
                >
                  Explorer
                </Button>
                {/* Menu tanpa User Management untuk selain Admin */}
                <Button
                  color="inherit"
                  startIcon={<TableChartIcon />}
                  component={Link}
                  to="/table"
                  sx={{
                    backgroundColor: location.pathname === "/table" ? "#50575d" : "inherit",
                    "&:hover": { backgroundColor: "#6a737d" },
                  }}
                >
                  Tabel
                </Button>
                <Button
                  color="inherit"
                  startIcon={<LinkIcon />}
                  component={Link}
                  to="/links"
                  sx={{
                    backgroundColor: location.pathname === "/links" ? "#50575d" : "inherit",
                    "&:hover": { backgroundColor: "#6a737d" },
                  }}
                >
                  Link Penting
                </Button>
                {auth.role === "admin" && (
                  <Button
                    color="inherit"
                    startIcon={<PeopleIcon />}
                    component={Link}
                    to="/user-management"
                    sx={{
                      backgroundColor: location.pathname === "/user-management" ? "#50575d" : "inherit",
                      "&:hover": { backgroundColor: "#6a737d" },
                    }}
                  >
                    User Management
                  </Button>
                )}
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: anchorEl ? "#50575d" : "inherit",
                    "&:hover": { backgroundColor: "#6a737d" },
                  }}
                >
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
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer anchor="bottom" open={accountDrawerOpen} onClose={handleAccountDrawerClose} sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography variant="body1">Nama: {name}</Typography>
          <Typography variant="body1">Role: {auth.role}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleLogout();
              handleMenuClose();
              handleAccountDrawerClose();
            }}
            fullWidth
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
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
        <MenuItem  onClick={() => {
              handleLogout();
              handleMenuClose();
              handleAccountDrawerClose();
            }}>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
