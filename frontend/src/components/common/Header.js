import React from 'react';
import { AppBar, Container, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { PowerSettingsNew as PowerSettingsNewIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, handleLogout }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#282c34' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        INOVEAZY
                    </Typography>
                    {isAuthenticated && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/explorer">
                                Explorer
                            </Button>
                            <Button color="inherit" component={Link} to="/table">
                                Tabel
                            </Button>
                            <Button color="inherit" component={Link} to="/links">
                                Link Penting
                            </Button>
                            <IconButton color="inherit" onClick={handleLogout}>
                                <PowerSettingsNewIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
