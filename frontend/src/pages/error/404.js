import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            textAlign="center"
            sx={{ backgroundColor: '#f9f9f9' }}
        >
            <Typography variant="h1" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" gutterBottom>
                Halaman Tidak Ditemukan
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Maaf, halaman yang Anda cari tidak ditemukan.
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

export default NotFoundPage;
