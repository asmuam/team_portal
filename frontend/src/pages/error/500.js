import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ServerErrorPage = () => {
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
                500
            </Typography>
            <Typography variant="h4" gutterBottom>
                Terjadi Kesalahan di Server
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Maaf, terjadi kesalahan pada server kami. Silakan coba lagi nanti.
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

export default ServerErrorPage;
