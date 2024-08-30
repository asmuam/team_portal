import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, IconButton, Modal, TextField, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import "./Kegiatan.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExploreBreadcrumb from "./common/ExploreBreadcrumb";
import AddButton from "./common/AddButton";
import { useDriveLink } from "../context/DriveContext";
import DriveButton from "./common/DriveButton";

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

const ActivityBox = styled(Box)({
  position: "relative",
  padding: "20px",
  border: "2px solid #333",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e0e0e0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

const ActivityName = styled(Typography)({
  fontSize: "1.5em",
  fontWeight: 900,
  marginBottom: "10px",
});

const ActivityActions = styled(Box)({
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "10px",
  padding: "5px",
});

const ActionIcon = styled("span")({
  backgroundColor: "#ddd",
  padding: "8px",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#bbb",
  },
});

const PaginationControls = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
});

function Kegiatan() {
  const { teamId } = useParams();
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newDeskripsi, setNewDeskripsi] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_API_URL;
  const { setLinkDrive, linkDrive } = useDriveLink(); // Access the link_drive from context

  const openModal = (type, activityId = null, activityName = "", tanggal = "", deskripsi = "") => {
    setModalType(type);
    setCurrentActivityId(activityId);
    setNewActivityName(activityName);
    setNewDeskripsi(deskripsi);
    setTanggalPelaksanaan(tanggal ? new Date(tanggal).toISOString().substr(0, 10) : ""); // Format to YYYY-MM-DD
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActivityId(null);
    setNewActivityName("");
    setTanggalPelaksanaan("");
    setNewDeskripsi("");
  };

  const refetchActivities = async () => {
    try {
      const response = await fetch(`${URL}/teams/${teamId}/activities`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  useEffect(() => {
    if (teamId) {
      refetchActivities();
    }
  }, [teamId]);

  const handleActivityClick = (activityId, link_drive) => {
    setLinkDrive(link_drive); // Set the link_drive in context
    navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan`);
  };

  const handleAddActivity = async () => {
    if (newActivityName) {
      setLoading(true);

      try {
        await axios.post(`${URL}/teams/${teamId}/activities/`, { name: newActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: newDeskripsi });
        setTimeout(() => {
          refetchActivities();
          closeModal();
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    }
  };

  const handleEditActivity = async () => {
    if (newActivityName) {
      try {
        await axios.patch(`${URL}/teams/${teamId}/activities/${currentActivityId}`, { name: newActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: newDeskripsi });
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        refetchActivities();
        closeModal();
      } catch (error) {
        console.error("Error updating activity:", error);
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddActivity() : handleEditActivity();
    }
  };

  const deleteActivity = async (Id) => {
    try {
      await axios.delete(`${URL}/teams/${teamId}/activities/${Id}`);
      refetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const archiveActivity = async (Id) => {
    alert("Fitur arsip belum tersedia");
    // Implement actual archiving logic here if needed
    refetchActivities();
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // const indexOfLastActivity = currentPage * activitiesPerPage;
  // const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  // const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  // const totalPages = Math.ceil(activities.length / activitiesPerPage);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentActivities = activities.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(activities.length / tasksPerPage);
  const driveFolderUrl = linkDrive;
  setLinkDrive(driveFolderUrl)

  return (
    <div className="kegiatan">
      <div className="header">
        <ExploreBreadcrumb />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/explorer")}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 600,
            padding: "10px 20px",
            textTransform: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            backgroundColor: "#007bff", // Set a primary color for consistency
            color: "#ffffff", // Ensure text color is visible on the background
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
            marginRight: "10px", // Add margin to the right for spacing
          }}
        >
          Back
        </Button>
        <AddButton onClick={() => openModal("add")} text="Tambah Kegiatan" />
        <DriveButton driveFolderUrl={driveFolderUrl}/>
      </div>

      <div className="activity-list">
        {currentActivities.map((activity) => (
          <ActivityBox key={activity.id} onClick={() => handleActivityClick(activity.id, activity.link_drive)} style={{ marginBottom: "20px;" }}>
            <ActivityName>{activity.name}</ActivityName>
            <Typography variant="body2" color="textSecondary">
              Tanggal : {formatDate(activity.tanggal_pelaksanaan)} {/* Format tanggal */}
            </Typography>
            <br />
            <Typography variant="body2" color="textSecondary">
              Deskripsi : {activity.deskripsi} {/* Format tanggal */}
            </Typography>
            <ActivityActions>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("edit", activity.id, activity.name, activity.tanggal_pelaksanaan, activity.deskripsi);
                }}
                sx={{
                  backgroundColor: "#ddd",
                  padding: "8px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#bbb",
                  },
                }}
              >
                <span>&#9998;</span> {/* Edit icon */}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteActivity(activity.id);
                }}
                sx={{
                  backgroundColor: "#ddd",
                  padding: "8px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#bbb",
                  },
                }}
              >
                <span>&#10006;</span> {/* Delete icon */}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  archiveActivity(activity.id);
                }}
                sx={{
                  backgroundColor: "#ddd",
                  padding: "8px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#bbb",
                  },
                }}
              >
                <span>&#128229;</span> {/* Archive icon */}
              </IconButton>
            </ActivityActions>
          </ActivityBox>
        ))}
      </div>
      {activities.length > tasksPerPage && (
        <PaginationControls style={{ marginTop: "-35px" }}>
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ fontSize: "25px" }}>
            &lt;
          </Button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ fontSize: "25px" }}>
            &gt;
          </Button>
        </PaginationControls>
      )}

      <Modal open={isModalOpen} onClose={closeModal} aria-labelledby="activity-modal-title" aria-describedby="activity-modal-description">
        <ModalContent>
          <Header id="activity-modal-title" variant="h6">
            {modalType === "add" ? "Tambah Kegiatan Baru" : "Edit Kegiatan"}
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
            label="Nama Kegiatan"
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
          <Button disabled={loading} variant="contained" color="primary" onClick={modalType === "add" ? handleAddActivity : handleEditActivity} fullWidth>
            {modalType === "add" ? "Tambah Kegiatan" : "Update Kegiatan"}
            {loading ? <CircularProgress size={24} color="inherit" /> : modalType === "" ? "" : ""}
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Kegiatan;
