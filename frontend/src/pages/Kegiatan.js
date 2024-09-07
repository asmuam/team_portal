import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import ExploreBreadcrumb from "../components/common/navigation/ExploreBreadcrumb";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDriveLink } from "../context/DriveContext";
import DriveButton from "../components/common/button/DriveButton";
import AddButton from "../components/common/button/AddButton";
import DeleteConfirmationModal from "../components/common/alert/deleteModal";
import TambahKegiatanModal from "../components/explorer/kegiatan/TambahKegiatanModal";
import ActivityList from "../components/explorer/kegiatan/KegiatanList";
import useAxiosPrivate from "../hooks/use-axios-private";

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
  bottom: "10px",
  right: "10px",
  display: "flex",
  gap: "10px",
  padding: "5px",
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [newActivityName, setNewActivityName] = useState("");
  const [newDeskripsi, setNewDeskripsi] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const { setLinkDrive, linkDrive } = useDriveLink(); // Access the link_drive from context
  const apiPrivate = useAxiosPrivate();
  const driveFolderUrl = linkDrive;
  useEffect(() => {
    if (teamId) {
      refetchActivities();
      refetchLink();
    }
  }, [teamId]);
  const openModal = (
    type,
    activityId = null,
    activityName = "",
    tanggal = "",
    deskripsi = ""
  ) => {
    setModalType(type);
    setCurrentActivityId(activityId);
    setNewActivityName(activityName);
    setNewDeskripsi(deskripsi);
    setTanggalPelaksanaan(
      tanggal ? new Date(tanggal).toISOString().substr(0, 10) : ""
    ); // Format to YYYY-MM-DD
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActivityId(null);
    setNewActivityName("");
    setTanggalPelaksanaan("");
    setNewDeskripsi("");
  };
  const openDeleteModal = (activityId) => {
    setCurrentActivityId(activityId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentActivityId(null);
  };
  const refetchActivities = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams/${teamId}/activities`);

      // Periksa apakah status responnya 200 OK
      if (response.status === 200) {
        const data = response.data; // Data dari respons
        setActivities(data);
      } else {
        throw new Error("Failed to fetch activities: " + response.status);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };
  const refetchLink = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams/${teamId}`);

      // Periksa apakah status responnya 200 OK
      if (response.status === 200) {
        const data = response.data; // Data dari respons
        setLinkDrive(data.link_drive);
      } else {
        throw new Error("Failed to fetch activities: " + response.status);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };
  const handleActivityClick = (activityId, link_drive) => {
    setLinkDrive(link_drive); // Set the link_drive in context
    navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan`);
  };
  const handleAddActivity = async () => {
    if (newActivityName) {
      setLoading(true);

      try {
        await apiPrivate.post(`/teams/${teamId}/activities/`, {
          name: newActivityName,
          tanggal_pelaksanaan: tanggalPelaksanaan,
          deskripsi: newDeskripsi,
        });
        setTimeout(() => {
          refetchActivities();
          closeModal();
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error adding activity:", error);
        setLoading(false);
      }
    }
  };
  const handleEditActivity = async () => {
    if (newActivityName) {
      setLoading(true);

      try {
        await apiPrivate.patch(
          `/teams/${teamId}/activities/${currentActivityId}`,
          {
            name: newActivityName,
            tanggal_pelaksanaan: tanggalPelaksanaan,
            deskripsi: newDeskripsi,
          }
        );
        setTimeout(() => {
          refetchActivities();
          closeModal();
          setLoading(false);
        }, 2000);
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
  const deleteActivity = async () => {
    try {
      await apiPrivate.delete(
        `/teams/${teamId}/activities/${currentActivityId}`
      );
      refetchActivities();
      closeDeleteModal();
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
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div className="kegiatan">
      <div
        className="header"
        style={{ marginBottom: "10px", position: "relative" }}
      >
        {/* Bagian Back dan Tambah */}
        <ExploreBreadcrumb />

        <div style={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <IconButton
              onClick={() => navigate("/explorer")}
              style={{
                backgroundColor: "#007bff",
                color: "#ffffff",
                marginRight: "10px",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
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
                backgroundColor: "#007bff",
                color: "#ffffff",
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
                marginRight: "10px",
              }}
            >
              Back
            </Button>
          )}
          {isMobile ? (
            <AddButton onClick={() => openModal("add")} text="Tambah " />
          ) : (
            <AddButton
              onClick={() => openModal("add")}
              text="Tambah Kegiatan "
            />
          )}
        </div>

        {/* Bagian Drive */}
        <div style={{ position: "absolute", right: 0, top: "28px" }}>
          <DriveButton driveFolderUrl={driveFolderUrl} />
        </div>
      </div>

      <ActivityList
        activities={activities}
        onActivityClick={handleActivityClick}
        onEditClick={(id, name, tanggal, deskripsi) =>
          openModal("edit", id, name, tanggal, deskripsi)
        }
        onDeleteClick={openDeleteModal}
        onArchiveClick={archiveActivity}
      />

      <TambahKegiatanModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        modalType={modalType}
        newActivityName={newActivityName}
        setNewActivityName={setNewActivityName}
        tanggalPelaksanaan={tanggalPelaksanaan}
        setTanggalPelaksanaan={setTanggalPelaksanaan}
        newDeskripsi={newDeskripsi}
        setNewDeskripsi={setNewDeskripsi}
        handleAddActivity={handleAddActivity}
        handleEditActivity={handleEditActivity}
        loading={loading}
      />

      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        deleteActivity={deleteActivity}
        deleteItemName="Kegiatan"
      />
    </div>
  );
}

export default Kegiatan;
