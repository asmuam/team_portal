// src/components/TambahSubKegiatanModal.js
import React from "react";
import { Box, Button, Typography, IconButton, Modal, TextField, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

// Styled Components
const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
});

const Header = styled(Typography)({
  marginBottom: "16px",
  position: "relative",
  paddingRight: "32px",
});

const InputField = styled(TextField)({
  width: "100%",
  marginBottom: "16px",
});

function TambahSubKegiatanModal({ isModalOpen, closeModal, modalType, newActivityName, setNewActivityName, tanggalPelaksanaan, setTanggalPelaksanaan, newDeskripsi, setNewDeskripsi, handleAddActivity, handleEditActivity, loading }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddActivity() : handleEditActivity();
    }
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal} aria-labelledby="activity-modal-title" aria-describedby="activity-modal-description">
      <ModalContent>
        <Header id="activity-modal-title" variant="h6">
          {modalType === "add" ? "Tambah Sub Kegiatan Baru" : "Edit Sub Kegiatan"}
          <IconButton
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Header>
        <InputField
          label="Nama Sub Kegiatan"
          variant="outlined"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          onKeyDown={handleKeyPress} // Handle "Enter" key press
          required
        />

        <InputField
          label="Tanggal Pelaksanaan"
          type="date"
          variant="outlined"
          value={tanggalPelaksanaan}
          onChange={(e) => setTanggalPelaksanaan(e.target.value)}
          onKeyDown={handleKeyPress}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <InputField
          label="Deskripsi"
          variant="outlined"
          value={newDeskripsi}
          onChange={(e) => setNewDeskripsi(e.target.value)}
          onKeyDown={handleKeyPress} // Handle "Enter" key press
          required
        />
        <Button disabled={loading} variant="contained" color="primary" onClick={modalType === "add" ? handleAddActivity : handleEditActivity} fullWidth startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}>
          {!loading && (modalType === "add" ? "Tambah Sub Kegiatan" : "Update Sub Kegiatan")}
        </Button>
      </ModalContent>
    </Modal>
  );
}

export default TambahSubKegiatanModal;
