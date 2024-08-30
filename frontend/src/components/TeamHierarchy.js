import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import "./TeamHierarchy.css";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ExploreBreadcrumb from "./common/ExploreBreadcrumb";

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

function TeamHierarchy({ teams, setTeams }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const navigate = useNavigate();

  const URL = process.env.REACT_APP_API_URL;

  const openModal = (type, teamId = null, teamName = "") => {
    setModalType(type);
    setCurrentTeamId(teamId);
    setNewTeamName(teamName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTeamId(null);
    setNewTeamName("");
  };

  const refetchTeams = async () => {
    try {
      const response = await fetch(`${URL}/teams`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  const handleTeamClick = (e, id) => {
    e.stopPropagation(); // Prevent unwanted navigation
    navigate(`/explorer/kegiatan/${id}`);
  };

  const handleAddTeam = async () => {
    if (newTeamName) {
      try {
        await axios.post(`${URL}/teams`, { name: newTeamName });
        refetchTeams();
        closeModal();
      } catch (error) {
        console.error("Error adding team:", error);
      }
    }
  };

  const handleEditTeam = async (id) => {
    if (newTeamName) {
      try {
        await axios.patch(`${URL}/teams/${id}`, { name: newTeamName });
        refetchTeams();
        closeModal();
      } catch (error) {
        console.error("Error renaming team:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddTeam() : handleEditTeam(currentTeamId);
    }
  };

  const deleteTeam = async (id) => {
    try {
      await axios.delete(`${URL}/teams/${id}`);
      refetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const archiveTeam = async (e, id) => {
    e.stopPropagation(); // Prevent unwanted navigation
    // alert(`Tim Kerja ${teams.find((team) => team.id === id).name} telah diarsipkan.`);
    alert("Fitur arsip belum tersedia"); // You can implement actual archiving logic here if needed
    refetchTeams();
  };

  return (
    <div className="team-hierarchy">
      <div className="header">
        <ExploreBreadcrumb />
        <Button
          variant="contained"
          color="primary"
          onClick={() => openModal("add")}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 600,
            padding: "10px 20px",
            textTransform: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#0056b3",
              boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
            },
            "&:active": {
              backgroundColor: "#004494",
              transform: "scale(0.98)",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 3px rgba(38, 143, 255, 0.5)",
            },
          }}
        >
          Tambah Tim Baru
        </Button>
      </div>
      <div className="team-list">
        {teams.map((team) => (
          <div className="team-container" key={team.id}>
            <div className="team-box" onClick={(e) => handleTeamClick(e, team.id)}>
              <div className="team-name">{team.name} </div>
              <div className="team-name">Ketua : Adib Sulthon </div>
              <div className="team-name">Deskripsi : Mengelola Data </div>
              <div className="team-actions">
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent unwanted navigation
                    openModal("edit", team.id, team.name); // Open modal with team details
                  }}
                >
                  &#9998;
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent unwanted navigation
                    deleteTeam(team.id);
                  }}
                >
                  &#10006;
                </span>
                <span onClick={(e) => archiveTeam(e, team.id)}>&#128229;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={isModalOpen} onClose={closeModal} aria-labelledby="team-modal-title" aria-describedby="team-modal-description">
        <ModalContent>
          <Header id="team-modal-title" variant="h6">
            {modalType === "add" ? "Tambah Tim Baru" : "Edit Nama Tim"}
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
            label="Nama Tim"
            variant="outlined"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={handleKeyPress} // Handle "Enter" key press
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={modalType === "add" ? handleAddTeam : () => handleEditTeam(currentTeamId)} // Pastikan ID tim yang benar dikirim ke fungsi
          >
            {modalType === "add" ? "Tambah" : "Simpan"}
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TeamHierarchy;
