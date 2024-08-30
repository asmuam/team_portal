import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Button, TextField, Typography, IconButton, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import "./TeamHierarchy.css";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ExploreBreadcrumb from "./common/ExploreBreadcrumb";
import AddButton from "./common/AddButton";

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

const FormControlStyled = styled(FormControl)({
  width: "100%",
  marginBottom: "16px",
});

function TeamHierarchy({ teams, setTeams }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newDeskripsi, setNewDeskripsi] = useState(""); // State for deskripsi
  const [users, setUsers] = useState([]); // State for users
  const [selectedKetua, setSelectedKetua] = useState(""); // State for selected ketua ID
  const navigate = useNavigate();

  const URL = process.env.REACT_APP_API_URL;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${URL}/users/pegawai`);
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [URL]);

  const openModal = (type, teamId = null, teamName = "", ketua = "", deskripsi = "") => {
    setModalType(type);
    setCurrentTeamId(teamId);
    setNewTeamName(teamName);
    setSelectedKetua(ketua); // Set selected ketua
    setNewDeskripsi(deskripsi);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTeamId(null);
    setNewTeamName("");
    setSelectedKetua(""); // Clear selected ketua
    setNewDeskripsi("");
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
    if (newTeamName && selectedKetua && newDeskripsi) {
      try {
        await axios.post(`${URL}/teams`, {
          name: newTeamName,
          leader_id: selectedKetua, // Use selected ketua ID
          deskripsi: newDeskripsi,
        });
        refetchTeams();
        closeModal();
      } catch (error) {
        console.error("Error adding team:", error);
      }
    }
  };

  const handleEditTeam = async (id) => {
    if (newTeamName && selectedKetua && newDeskripsi) {
      try {
        await axios.patch(`${URL}/teams/${id}`, {
          name: newTeamName,
          leader_id: selectedKetua, // Use selected ketua ID
          deskripsi: newDeskripsi,
        });
        refetchTeams();
        closeModal();
      } catch (error) {
        console.error("Error editing team:", error);
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
    alert("Fitur arsip belum tersedia"); // You can implement actual archiving logic here if needed
    refetchTeams();
  };

  return (
    <div className="team-hierarchy">
      <div className="header">
        <ExploreBreadcrumb />
        <AddButton onClick={() => openModal("add")} text="Tambah Tim Baru" />
      </div>
      <div className="team-list">
        {teams.map((team) => (
          <div className="team-container" key={team.id}>
            <div className="team-box" onClick={(e) => handleTeamClick(e, team.id)}>
              <div className="team-name">{team.name}</div>
              <div className="team-ketua">Ketua :{team.leader.name}</div> {/* Display ketua */}
              <br />
              <div className="team-deskripsi">Deskripsi : {team.deskripsi}</div> {/* Display deskripsi */}
              <div className="team-actions">
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent unwanted navigation
                    openModal("edit", team.id, team.name, team.ketua, team.deskripsi); // Pass ketua and deskripsi to modal
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
          <FormControlStyled variant="outlined">
            <InputLabel id="ketua-select-label">Ketua</InputLabel>
            <Select
              labelId="ketua-select-label"
              value={selectedKetua}
              onChange={(e) => setSelectedKetua(e.target.value)}
              onKeyDown={handleKeyPress} // Handle "Enter" key press
              label="Ketua" // Ensure the label matches the InputLabel
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControlStyled>
          <InputField
            label="Deskripsi"
            variant="outlined"
            value={newDeskripsi}
            onChange={(e) => setNewDeskripsi(e.target.value)}
            onKeyDown={handleKeyPress} // Handle "Enter" key press
            required
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={modalType === "add" ? handleAddTeam : () => handleEditTeam(currentTeamId)} // Ensure correct ID is passed
          >
            {modalType === "add" ? "Tambah" : "Simpan"}
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TeamHierarchy;
