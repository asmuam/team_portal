import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center",
};

const LogoutModal = ({ open, handleClose, handleLogout }) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="logout-modal-title" aria-describedby="logout-modal-description">
      <Box sx={style}>
        <Typography id="logout-modal-title" variant="h6" component="h2">
          Confirm Logout
        </Typography>
        <Typography id="logout-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to log out?
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Yes, Log Out
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
