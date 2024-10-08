import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Tugas from "./Tugas";
import { Box, Button, Typography, IconButton, Modal, TextField } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExploreBreadcrumb from "../components/common/navigation/ExploreBreadcrumb";
import DriveButton from "../components/common/button/DriveButton";
import { useDriveLink } from "../context/DriveContext";
import AddButton from "../components/common/button/AddButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteConfirmationModal from "../components/common/alert/deleteModal";
import useAxiosPrivate from "../hooks/use-axios-private.js";
import TambahSubKegiatanModal from "../components/explorer/subKegiatan/TambahSubKegiatanModal.js";
import SubActivityList from "../components/explorer/subKegiatan/SubKegiatanList.js";

// Styled Components
const ModalContent = styled(Box)(({ isMobile }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isMobile ? 300 : 400,
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
}));

const Header = styled(Typography)({
  marginBottom: "16px",
  position: "relative",
  paddingRight: "32px",
});

const InputField = styled(TextField)({
  width: "100%",
  marginBottom: "16px",
});

const SubActivityBox = styled(Box)({
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

const SubActivityName = styled(Typography)({
  fontSize: "1.5em",
  fontWeight: 900,
  marginBottom: "10px",
});

const SubActivityActions = styled(Box)({
  position: "absolute",
  bottom: "10px",
  right: "10px",
  display: "flex",
  gap: "10px",
  padding: "5px",
});

function SubKegiatan() {
  const { teamId, activityId } = useParams();
  const [subActivities, setSubActivities] = useState([]);
  const [activeSubActivities, setActiveSubActivities] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentSubActivityId, setCurrentSubActivityId] = useState(null);
  const [subActivityName, setSubActivityName] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [currentPage, setCurrentPage] = useState(1);
  const { setLinkDrive, linkDrive } = useDriveLink(); // Access the link_drive from context
  const apiPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const driveFolderUrl = linkDrive;
  useEffect(() => {
    if (activityId && teamId) {
      refetchSubActivities();
      refetchActivityDetails();
      refetchLink();
    }
  }, [activityId, teamId]);
  const refetchLink = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}`);

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
  const openModal = (type, subActivityId = null, name = "", tanggal = "", deskripsi = "") => {
    setModalType(type);
    setCurrentSubActivityId(subActivityId);
    setSubActivityName(name);
    setDeskripsi(deskripsi);
    setTanggalPelaksanaan(tanggal ? new Date(tanggal).toISOString().substr(0, 10) : "");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSubActivityId(null);
    setSubActivityName("");
    setTanggalPelaksanaan("");
    setDeskripsi("");
  };
  const openDeleteModal = (subActivityId) => {
    setCurrentSubActivityId(subActivityId);
    setIsDeleteModalOpen(true);
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentSubActivityId(null);
  };
  const PaginationControls = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  });
  const refetchSubActivities = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}/sub-activities`);

      // Periksa apakah status responnya 200 OK
      if (response.status === 200) {
        const data = response.data; // Data dari respons
        setSubActivities(data);
      } else {
        throw new Error("Failed to fetch sub-activities: " + response.status);
      }
    } catch (error) {
      console.error("Failed to fetch sub-activities:", error);
    }
  };
  const refetchActivityDetails = async () => {
    try {
      // Gunakan apiPrivate untuk melakukan permintaan
      const response = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}/sub-activities`);

      // Periksa apakah status responnya 200 OK
      if (response.status === 200) {
        const data = response.data; // Data dari respons
        setActivityDetails(data);
      } else {
        throw new Error("Failed to fetch activity details: " + response.status);
      }
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };
  const toggleSubActivityTasks = (subActivityId) => {
    setActiveSubActivities((prevState) => (prevState.includes(subActivityId) ? prevState.filter((id) => id !== subActivityId) : [...prevState, subActivityId]));
  };
  const handleAddSubActivity = async () => {
    if (subActivityName) {
      setLoading(true);
      try {
        await apiPrivate.post(`/teams/${teamId}/activities/${activityId}/sub-activities`, { name: subActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: deskripsi });
        setTimeout(() => {
          refetchSubActivities();
          closeModal();
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error adding sub-activity:", error);
      }
    }
  };
  const handleEditSubActivity = async () => {
    if (subActivityName) {
      setLoading(true);

      try {
        await apiPrivate.patch(`/teams/${teamId}/activities/${activityId}/sub-activities/${currentSubActivityId}`, { name: subActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: deskripsi });
        setTimeout(() => {
          refetchSubActivities();
          closeModal();
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error updating sub-activity:", error);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddSubActivity() : handleEditSubActivity();
    }
  };
  const deleteSubActivity = async () => {
    try {
      await apiPrivate.delete(`/teams/${teamId}/activities/${activityId}/sub-activities/${currentSubActivityId}`);
      refetchSubActivities();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting sub-activity:", error);
    }
  };
  const archiveSubActivity = async (subActivityId) => {
    alert("Fitur arsip belum tersedia");
    refetchSubActivities();
  };
  const handleSubActivityClick = (subActivityId, link_drive) => {
    setLinkDrive(link_drive);
    navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan/${subActivityId}/tugas`);
  };
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="sub-activity-container">
      <div className="header" style={{ marginBottom: "10px", position: "relative" }}>
        {/* Bagian Back dan Tambah */}
        <ExploreBreadcrumb />

        <div style={{ display: "flex", alignItems: "center" }}>
          {isMobile ? (
            <IconButton onClick={() => navigate(`/explorer/team/${teamId}/kegiatan`)} style={{ backgroundColor: "#007bff", color: "#ffffff", marginRight: "10px" }}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/explorer/team/${teamId}/kegiatan`)}
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

          {isMobile ? <AddButton onClick={() => openModal("add")} text="Tambah " /> : <AddButton onClick={() => openModal("add")} text="Tambah Sub Kegiatan " />}
        </div>

        {/* Bagian Drive */}
        <div style={{ position: "absolute", right: 0, top: "28px" }}>
          <DriveButton driveFolderUrl={driveFolderUrl} />
        </div>
      </div>

      <SubActivityList
        subActivities={subActivities}
        onSubActivityClick={handleSubActivityClick}
        onEditClick={(id, name, tanggal, deskripsi) => openModal("edit", id, name, tanggal, deskripsi)}
        onDeleteClick={openDeleteModal}
        onArchiveClick={archiveSubActivity}
      />

      <TambahSubKegiatanModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        modalType={modalType}
        newActivityName={subActivityName}
        setNewActivityName={setSubActivityName}
        tanggalPelaksanaan={tanggalPelaksanaan}
        setTanggalPelaksanaan={setTanggalPelaksanaan}
        newDeskripsi={deskripsi}
        setNewDeskripsi={setDeskripsi}
        handleAddActivity={handleAddSubActivity}
        handleEditActivity={handleEditSubActivity}
        loading={loading}
      />

      <DeleteConfirmationModal isDeleteModalOpen={isDeleteModalOpen} closeDeleteModal={closeDeleteModal} deleteActivity={deleteSubActivity} deleteItemName="Sub-Kegiatan" />
    </div>
  );
}

export default SubKegiatan;
