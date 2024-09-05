import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useTeams } from "../context/TeamsContext";
import useAxiosPrivate from "../hooks/use-axios-private.js";

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
  const apiPrivate = useAxiosPrivate()

    // Fetch users on component mount
    useEffect(() => {
      refetchTeams();
        }, []);

  const handleToggleTeam = (teamId) => {
    setOpenTeam(openTeam === teamId ? null : teamId);
  };

  const refetchTeams = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams`);

      // Periksa apakah status responnya 200 OK
      if (response.status === 200) {
        const data = response.data; // Data dari respons
        setTeams(data);
      } else {
        throw new Error("Failed to fetch teams: " + response.status);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
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
      const response = await apiPrivate.post(`${API_URL}/teams/${currentTeamId}/links`, newLink);
      const { links } = response.data;
      setTeams((prevTeams) => prevTeams.map((team) => (team.id === currentTeamId ? { ...team, links } : team)));
      closeModal();
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleEditLink = async () => {
    const formattedUrl = formatUrl(linkUrl);
    try {
      const response = await apiPrivate.patch(`${API_URL}/teams/${currentTeamId}/links/${currentLinkId}`, {
        url: formattedUrl,
        description: linkDescription,
      });
      const { links } = response.data;
      setTeams((prevTeams) => prevTeams.map((team) => (team.id === currentTeamId ? { ...team, links } : team)));
      closeModal();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleDeleteLink = async (teamId, linkId) => {
    try {
      const response = await apiPrivate.delete(`${API_URL}/teams/${teamId}/links/${linkId}`);
      const { links } = response.data;
      setTeams((prevTeams) => prevTeams.map((team) => (team.id === teamId ? { ...team, links } : team)));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {teams.map((team) => (
        <Box key={team.id} sx={{ marginBottom: 2 }}>
          <Button variant="contained" fullWidth sx={{ justifyContent: "flex-start", textTransform: "none" }} onClick={() => handleToggleTeam(team.id)}>
            {openTeam === team.id ? "⮟" : "⮞"} {team.name}
          </Button>
          {openTeam === team.id && (
              <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    marginTop: 2,
                    "@media (max-width: 600px)": {
                      flexDirection: "column",
                    },
                  }}
              >
                {team.links.map((link) => (
                    <Box
                        key={link.id}
                        sx={{
                          flex: "1 1 calc(33.333% - 16px)", // 3 item per baris di layar besar
                          "@media (max-width: 600px)": {
                            flex: "1 1 100%", // 1 item per baris di layar kecil
                          },
                          padding: 2,
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          backgroundColor: "#f9f9f9",
                          maxWidth: "90%", // Menentukan lebar maksimum
                          overflow: "hidden", // Menyembunyikan konten yang melampaui batas
                        }}
                    >
                      <Typography
                          variant="body1"
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textDecoration: "none",
                            color: "primary.main",
                            display: "block",
                            marginBottom: 1,
                            whiteSpace: "nowrap", // Mencegah baris baru
                            overflow: "hidden",
                            textOverflow: "ellipsis", // Menambahkan ellipsis pada teks panjang
                          }}
                      >
                        {link.url}
                      </Typography>
                      <Typography
                          variant="body2"
                          sx={{
                            marginBottom: 1,
                            whiteSpace: "nowrap", // Mencegah baris baru
                            overflow: "hidden",
                            textOverflow: "ellipsis", // Menambahkan ellipsis pada teks panjang
                          }}
                      >
                        {link.description}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button onClick={() => openModal("edit", team.id, link.id, link.url, link.description)} size="small">
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteLink(team.id, link.id)} size="small" color="error">
                          Delete
                        </Button>
                      </Box>
                    </Box>
                ))}
                <Button variant="outlined" onClick={() => openModal("add", team.id)}>
                  Add Another Link
                </Button>
              </Box>

          )}
        </Box>
      ))}

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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            {modalType === "add" ? "Add New Link" : "Edit Link"}
          </Typography>
          <TextField label="Link URL" fullWidth value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} margin="normal" />
          <TextField label="Description" fullWidth value={linkDescription} onChange={(e) => setLinkDescription(e.target.value)} margin="normal" />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button onClick={modalType === "add" ? handleAddLink : handleEditLink} variant="contained" color="primary">
              {modalType === "add" ? "Add Link" : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LinkPenting;
