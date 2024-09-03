import React from 'react';
import {
    Modal,
    Typography,
    Box,
    Button,
    IconButton,
    styled,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    maxWidth: '400px',
    margin: theme.spacing(2),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

export default function DeleteConfirmationModal({
                                                    isDeleteModalOpen,
                                                    closeDeleteModal,
                                                    deleteActivity,
                                                    deleteItemName, // New parameter for the item name
                                                }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    padding: theme.spacing(2),
                }}
            >
                <ModalContent>
                    <Header>
                        <Typography variant={isMobile ? 'h6' : 'h5'}>Konfirmasi Hapus {deleteItemName}</Typography>
                        <IconButton onClick={closeDeleteModal} sx={{ color: theme.palette.grey[500] }}>
                            <CloseIcon />
                        </IconButton>
                    </Header>
                    <Typography variant="body1">
                        Apakah Anda yakin ingin menghapus {deleteItemName} ini?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing(2) }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={deleteActivity}
                            sx={{
                                minWidth: '100px',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                            }}
                        >
                            Hapus
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={closeDeleteModal}
                            sx={{
                                minWidth: '100px',
                                fontSize: isMobile ? '0.875rem' : '1rem',
                                borderColor: theme.palette.error.main,
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.error.light,
                                },
                            }}
                        >
                            Batal
                        </Button>
                    </Box>
                </ModalContent>
            </Box>
        </Modal>
    );
}
