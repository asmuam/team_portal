// src/components/modal/TambahTeam.js

import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  header: {
    marginBottom: "16px",
  },
  inputField: {
    width: "100%",
    marginBottom: "16px",
  },
  button: {
    marginRight: "8px",
  },
}));

const TambahTeam = ({ closeModal, handleAddTeam }) => {
  const [teamName, setTeamName] = useState("");
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamName) {
      handleAddTeam({ name: teamName });
      closeModal();
    }
  };

  return (
    <Modal open={true} onClose={closeModal} aria-labelledby="add-team-modal-title" aria-describedby="add-team-modal-description">
      <Box className={classes.modalContent}>
        <Typography id="add-team-modal-title" variant="h6" className={classes.header}>
          Tambah Tim Baru
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField id="team-name" label="Nama Tim" variant="outlined" value={teamName} onChange={(e) => setTeamName(e.target.value)} className={classes.inputField} required />
          <div>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Tambah
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Tutup
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default TambahTeam;
