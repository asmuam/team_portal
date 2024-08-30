import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: '#282c34', py: 3, mt: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="white" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body2" color="white">
                            INOVEAZY is dedicated to providing innovative solutions for modern businesses. Our goal is to empower teams to reach their full potential.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="white" gutterBottom>
                            Quick Links
                        </Typography>
                        <Typography variant="body2" color="white" component={Link} to="/explorer" sx={{ display: 'block', textDecoration: 'none' }}>
                            Explorer
                        </Typography>
                        <Typography variant="body2" color="white" component={Link} to="/table" sx={{ display: 'block', textDecoration: 'none' }}>
                            Tabel
                        </Typography>
                        <Typography variant="body2" color="white" component={Link} to="/links" sx={{ display: 'block', textDecoration: 'none' }}>
                            Link Penting
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="white" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" color="white">
                            Email: contact@inoveazy.com
                        </Typography>
                        <Typography variant="body2" color="white">
                            Phone: +123-456-7890
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                    <Typography variant="body2" color="white">
                        &copy; 2024 INOVEAZY. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};


export default Footer;