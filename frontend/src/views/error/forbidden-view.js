import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useAuth from '../../hooks/use-auth'; // Pastikan path ini benar
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Tampilan ketika pengguna yang sudah login mencoba mengakses halaman yang tidak diotorisasi kepadanya

const ForbiddenView = ({ message }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!auth.user) navigate(0);
    else navigate(-1);
  };

  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '100vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src="/error/forbidden_403.svg"
          sx={{
            mx: 'auto',
            height: { xs: 250, sm: 350 },
          }}
        />

        <Box sx={{ my: 5 }} component="div">
          <Typography variant="h3" sx={{ mb: 3 }}>
            Anda tidak diizinkan memasuki halaman ini!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
        </Box>

        <Button onClick={handleClick} size="large" variant="contained">
          Kembali
        </Button>
      </Box>
    </Container>
  );
};

// Menetapkan tipe properti dengan PropTypes
ForbiddenView.propTypes = {
  message: PropTypes.string,
};

export default ForbiddenView;
