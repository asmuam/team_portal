import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const TambahTeamModal = ({
  open,
  onClose,
  modalType,
  newTeamName,
  setNewTeamName,
  selectedKetua,
  setSelectedKetua,
  newDeskripsi,
  setNewDeskripsi,
  users,
  handleKeyPress,
  handleAddTeam,
  handleEditTeam,
  currentTeamId,
  loading, // New prop for loading state
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="team-modal-title" aria-describedby="team-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="team-modal-title" variant="h6" component="h2" mb={2}>
          {modalType === "add" ? "Tambah Tim Baru" : "Edit Nama Tim"}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
        <TextField label="Nama Tim" variant="outlined" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} onKeyDown={handleKeyPress} fullWidth required margin="normal" />
        <FormControl variant="outlined" fullWidth required margin="normal">
          <InputLabel id="ketua-select-label">Ketua</InputLabel>
          <Select labelId="ketua-select-label" value={selectedKetua} onChange={(e) => setSelectedKetua(e.target.value)} onKeyDown={handleKeyPress} label="Ketua">
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Deskripsi" variant="outlined" value={newDeskripsi} onChange={(e) => setNewDeskripsi(e.target.value)} onKeyDown={handleKeyPress} fullWidth required multiline rows={4} margin="normal" />
        <Button
          variant="contained"
          color="primary"
          onClick={modalType === "add" ? handleAddTeam : () => handleEditTeam(currentTeamId)}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading} // Disable button when loading
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : modalType === "add" ? "Tambah" : "Simpan"}
        </Button>
      </Box>
    </Modal>
  );
};

export default TambahTeamModal;
