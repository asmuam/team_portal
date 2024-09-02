import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useTeams } from '../context/TeamsContext'; // Adjust path as needed
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const LinkPenting = () => {
  const { teams, setTeams } = useTeams();
  const [openTeam, setOpenTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [currentLinkId, setCurrentLinkId] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  const handleToggleTeam = (teamId) => {
    setOpenTeam(openTeam === teamId ? null : teamId);
  };

  const formatUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `http://${url}`;
    }
    return url;
  };

  const openModal = (type, teamId, linkId = null, url = "", description = "") => {
    setModalType(type);
    setCurrentTeamId(teamId);
    setCurrentLinkId(linkId);
    setLinkUrl(url);
    setLinkDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLinkUrl("");
    setLinkDescription("");
  };

  const handleAddLink = async () => {
    const formattedUrl = formatUrl(linkUrl);
    const newLink = { url: formattedUrl, description: linkDescription };
    try {
      const response = await axios.post(`${API_URL}/teams/${currentTeamId}/links`, newLink);
      const { links } = response.data;
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === currentTeamId ? { ...team, links } : team
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleEditLink = async () => {
    const formattedUrl = formatUrl(linkUrl);
    try {
      const response = await axios.patch(`${API_URL}/teams/${currentTeamId}/links/${currentLinkId}`, {
        url: formattedUrl,
        description: linkDescription,
      });
      const { links } = response.data;
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === currentTeamId ? { ...team, links } : team
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleDeleteLink = async (teamId, linkId) => {
    try {
      const response = await axios.delete(`${API_URL}/teams/${teamId}/links/${linkId}`);
      const { links } = response.data;
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId ? { ...team, links } : team
        )
      );
    } catch (error) {
      console.error("Error deleting link:", error);
    }  };

  return (
    <div className="teams-container">
      {teams.map((team) => (
        <div key={team.id} className="team-item">
          <button className="team-toggle-button" onClick={() => handleToggleTeam(team.id)}>
            {openTeam === team.id ? "⮟" : "⮞"} {team.name}
          </button>
          {openTeam === team.id && (
            <div className="links-container">
              {team.links.map((link) => (
                <div key={link.id} className="link-item">
                  <div className="link-info">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
                      {link.url}
                    </a>
                    <div className="link-description">
                      <span>{link.description}</span>
                      <span className="info-icon" title={link.description}>
                        ℹ️
                      </span>
                    </div>
                  </div>
                  <div className="link-actions">
                    <span onClick={() => openModal("edit", team.id, link.id, link.url, link.description)} className="edit-icon">
                      &#9998;
                    </span>
                    <span onClick={() => handleDeleteLink(team.id, link.id)} className="delete-icon">
                      &#10006;
                    </span>
                  </div>
                </div>
              ))}
              <button onClick={() => openModal("add", team.id)}>Add Another Link</button>
            </div>
          )}
        </div>
      ))}

      {/* Modal for Adding/Editing Link */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <h2>{modalType === "add" ? "Add New Link" : "Edit Link"}</h2>
          <TextField label="Link URL" fullWidth value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} margin="normal" />
          <TextField label="Description" fullWidth value={linkDescription} onChange={(e) => setLinkDescription(e.target.value)} margin="normal" />
          <Box display="flex" justifyContent="flex-end" marginTop="16px">
            <Button onClick={modalType === "add" ? handleAddLink : handleEditLink} variant="contained" color="primary">
              {modalType === "add" ? "Add Link" : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default LinkPenting;
