import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Button, TextField, Typography, IconButton, Select, MenuItem, InputLabel, FormControl, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ExploreBreadcrumb from "../components/common/ExploreBreadcrumb";
import DriveButton from "../components/common/DriveButton";
import { useDriveLink } from "../context/DriveContext";
import AddButton from "../components/common/button/AddButton";
import TambahTeamModal from "../components/explorer/team/TambahTeamModal";
import {Archive, Delete, Edit} from "@mui/icons-material";
import TeamList from "../components/explorer/team/TeamList";

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
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const { setLinkDrive } = useDriveLink(); // Access the context setter

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

  const handleTeamClick = (e, id, link_drive) => {
    e.stopPropagation(); // Prevent unwanted navigation
    setLinkDrive(link_drive); // Set the link_drive in context
    navigate(`/explorer/team/${id}/kegiatan`);
  };

  const handleAddTeam = async () => {
    if (newTeamName && selectedKetua && newDeskripsi) {
      setLoading(true);
      try {
        await axios.post(`${URL}/teams`, {
          name: newTeamName,
          leader_id: selectedKetua, // Use selected ketua ID
          deskripsi: newDeskripsi,
        });

        // Simulasikan durasi loading (misalnya 2 detik)
        setTimeout(() => {
          refetchTeams();
          closeModal();
          setLoading(false);
        }, 2000); // 2000ms = 2 detik
      } catch (error) {
        console.error("Error adding team:", error);
        setLoading(false);
      }
    }
  };

  const handleEditTeam = async (id) => {
    if (newTeamName && selectedKetua && newDeskripsi) {
      setLoading(true);
      try {
        await axios.patch(`${URL}/teams/${id}`, {
          name: newTeamName,
          leader_id: selectedKetua, // Use selected ketua ID
          deskripsi: newDeskripsi,
        });

        // Simulasikan durasi loading (misalnya 2 detik)
        setTimeout(() => {
          refetchTeams();
          closeModal();
          setLoading(false);
        }, 2000); // 2000ms = 2 detik
      } catch (error) {
        console.error("Error editing team:", error);
        setLoading(false);
      }
    }
  };

  const deleteTeam = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${URL}/teams/${id}`);
      refetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddTeam() : handleEditTeam(currentTeamId);
    }
  };

  const archiveTeam = async (e, id) => {
    e.stopPropagation(); // Prevent unwanted navigation
    alert("Fitur arsip belum tersedia"); // You can implement actual archiving logic here if needed
    refetchTeams();
  };

  const driveFolderUrl = `https://drive.google.com/drive/folders/${process.env.REACT_APP_ROOT_DRIVE_FOLDER_ID}`;
  setLinkDrive(driveFolderUrl)
  return (
      <div className="team-hierarchy">
        <div className="header">
          <ExploreBreadcrumb/>
          <AddButton onClick={() => openModal("add")} text="Tambah Tim"/>
          <DriveButton driveFolderUrl={driveFolderUrl}/>
        </div>

        <TeamList
            teams={teams}
            handleTeamClick={handleTeamClick}
            deleteTeam={deleteTeam}
            archiveTeam={archiveTeam}
            openModal={openModal}
        />

        <TambahTeamModal
            open={isModalOpen}
            onClose={closeModal}
            modalType={modalType}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            selectedKetua={selectedKetua}
            setSelectedKetua={setSelectedKetua}
            newDeskripsi={newDeskripsi}
            setNewDeskripsi={setNewDeskripsi}
            users={users}
            handleKeyPress={handleKeyPress}
            handleAddTeam={handleAddTeam}
            handleEditTeam={handleEditTeam}
            currentTeamId={currentTeamId}
            loading={loading}
        />
      </div>
  );
}

export default TeamHierarchy;
