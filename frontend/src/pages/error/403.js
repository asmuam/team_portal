import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            sx={{ backgroundColor: '#f9f9f9' }}
        >
            <Typography variant="h1" color="error" gutterBottom>
                403
            </Typography>
            <Typography variant="h4" gutterBottom>
                Akses Dilarang
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                sx={{ mt: 2 }}
            >
                Kembali ke Beranda
            </Button>
        </Box>
    );
};

export default ForbiddenPage;