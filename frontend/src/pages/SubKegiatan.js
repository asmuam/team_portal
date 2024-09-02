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
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(4);
  const { setLinkDrive, linkDrive } = useDriveLink(); // Access the link_drive from context

  const URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

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
      const response = await fetch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSubActivities(data);
    } catch (error) {
      console.error("Failed to fetch sub-activities:", error);
    }
  };

  const refetchActivityDetails = async () => {
    try {
      const response = await fetch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setActivityDetails(data);
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };

  useEffect(() => {
    if (activityId && teamId) {
      refetchSubActivities();
      refetchActivityDetails();
    }
  }, [activityId, teamId]);

  const toggleSubActivityTasks = (subActivityId) => {
    setActiveSubActivities((prevState) => (prevState.includes(subActivityId) ? prevState.filter((id) => id !== subActivityId) : [...prevState, subActivityId]));
  };

  const handleAddSubActivity = async () => {
    if (subActivityName) {
      try {
        await axios.post(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities`, { name: subActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: deskripsi });
        refetchSubActivities();
        closeModal();
      } catch (error) {
        console.error("Error adding sub-activity:", error);
      }
    }
  };

  const handleEditSubActivity = async () => {
    if (subActivityName) {
      try {
        await axios.patch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${currentSubActivityId}`, { name: subActivityName, tanggal_pelaksanaan: tanggalPelaksanaan, deskripsi: deskripsi });
        refetchSubActivities();
        closeModal();
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
      await axios.delete(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${currentSubActivityId}`);
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

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = subActivities.slice(indexOfFirstActivity, indexOfLastActivity);

  const totalPages = Math.ceil(subActivities.length / activitiesPerPage);
  const driveFolderUrl = linkDrive;
  setLinkDrive(driveFolderUrl);

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

          <AddButton onClick={() => openModal("add")} text="Tambah " />
        </div>

        {/* Bagian Drive */}
        <div style={{ position: "absolute", right: 0, top: "28px" }}>
          <DriveButton driveFolderUrl={driveFolderUrl} />
        </div>
      </div>
      <div className="sub-activity-list">
        {currentActivities.map((subActivity) => (
          <div key={subActivity.id} style={{ marginBottom: "20px;" }}>
            <SubActivityBox onClick={() => handleSubActivityClick(subActivity.id, subActivity.link_drive)}>
              <SubActivityName>{subActivity.name}</SubActivityName>
              <Typography variant="body2" color="textSecondary">
                Tanggal: {formatDate(subActivity.tanggal_pelaksanaan)}
              </Typography>
              <br />
              <Typography variant="body2" color="textSecondary">
                Deskripsi: {subActivity.deskripsi}
              </Typography>
              <SubActivityActions>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("edit", subActivity.id, subActivity.name, subActivity.tanggal_pelaksanaan, subActivity.deskripsi);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(subActivity.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveSubActivity(subActivity.id);
                  }}
                >
                  <ArchiveIcon />
                </IconButton>
              </SubActivityActions>
            </SubActivityBox>
            {activeSubActivities.includes(subActivity.id) && <Tugas teamId={teamId} activityId={activityId} subActivityId={subActivity.id} />}
          </div>
        ))}
      </div>
      {subActivities.length > activitiesPerPage && (
        <PaginationControls style={{ display: "flex", justifyContent: "flex-start" }}>
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
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <Header>
            {modalType === "add" ? "Tambah Sub-Kegiatan" : "Edit Sub-Kegiatan"}
            <IconButton
              onClick={closeModal}
              sx={{
                position: "absolute",
                top: "4px",
                right: "4px",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Header>
          <InputField label="Nama Sub-Kegiatan" variant="outlined" value={subActivityName} onChange={(e) => setSubActivityName(e.target.value)} onKeyDown={handleKeyPress} required />
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
          <InputField label="Deskripsi" variant="outlined" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} onKeyDown={handleKeyPress} required />
          <Button variant="contained" color="primary" onClick={modalType === "add" ? handleAddSubActivity : handleEditSubActivity} fullWidth>
            {modalType === "add" ? "Tambah Sub-Kegiatan" : "Update Sub-Kegiatan"}
          </Button>
        </ModalContent>
      </Modal>
      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalContent>
          <Header>Konfirmasi Hapus Sub-Kegiatan</Header>
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>
            Apakah Anda yakin ingin menghapus Sub-Kegiatan ini?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="error" onClick={deleteSubActivity}>
              Hapus
            </Button>
            <Button variant="contained" onClick={closeDeleteModal}>
              Batal
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SubKegiatan;
