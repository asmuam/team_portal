import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext.js";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Modal, TextField, IconButton, Typography, RadioGroup, FormControlLabel, Radio, Tooltip } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";

import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExploreBreadcrumb from "../components/common/navigation/ExploreBreadcrumb";
import DriveButton from "../components/common/button/DriveButton";
import { useDriveLink } from "../context/DriveContext";
import AddButton from "../components/common/button/AddButton";
import DeleteConfirmationModal from "../components/common/alert/deleteModal";

import useAxiosPrivate from "../hooks/use-axios-private.js";

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
const TableContainer = styled(Box)({
  width: "100%",
  overflowX: "auto", // Menambahkan overflow horizontal
});

const TaskTable = styled("table")(({ isMobile }) => ({
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
  overflowX: "auto",
  minWidth: isMobile ? "100%" : "600px",
}));

const TableRow = styled("tr")(({ isMobile }) => ({
  display: isMobile ? "block" : "table-row",
  marginBottom: isMobile ? "10px" : "0",
}));

const TableHeader = styled("th")(({ isMobile }) => ({
  borderBottom: isMobile ? "none" : "2px solid #333",
  padding: isMobile ? "8px 0" : "10px",
  textAlign: isMobile ? "left" : "center",
  display: isMobile ? "block" : "table-cell",
}));

const TableCell = styled("td")(({ isMobile }) => ({
  borderBottom: isMobile ? "none" : "1px solid #ddd",
  padding: isMobile ? "8px 0" : "10px",
  textAlign: isMobile ? "left" : "center",
  display: isMobile ? "block" : "table-cell",
  "&:before": isMobile
    ? {
        content: "attr(data-label)",
        fontWeight: "bold",
        marginRight: "10px",
        display: "inline-block",
        minWidth: "100px",
      }
    : {},
}));
const Header = styled(Typography)({
  marginBottom: "16px",
  position: "relative",
  paddingRight: "32px",
});

const ActionButton = styled(IconButton)({
  backgroundColor: "#ddd",
  padding: "8px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#bbb",
  },
});

const ProgressWrapper = styled(Box)({
  marginTop: "15px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const ProgressText = styled(Typography)({
  fontWeight: "bold",
});
styled(IconButton)({
  marginBottom: "16px",
});

const PaginationControls = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "10px",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    alignItems: "center",
  },
});

const FileList = styled("ul")({
  listStyleType: "none",
  padding: 0,
});

const FileListItem = styled("li")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
  padding: "8px",
  backgroundColor: "#f1f1f1",
  borderRadius: "4px",
  wordWrap: "break-word",
});

const FileName = styled("span")({
  maxWidth: "200px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Tugas() {
  const { teamId, activityId, subActivityId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [link, setLink] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const { auth } = useContext(AuthContext);

  const [teamName, setTeamName] = useState("");
  const [activityName, setActivityName] = useState("");
  const [subActivityName, setSubActivityName] = useState("");
  const [subActivityTasks, setSubActivityTasks] = useState({});
  const { linkDrive } = useDriveLink(); // Access the link_drive from context

  const apiPrivate = useAxiosPrivate();

  // Calculate progress
  const calculateProgress = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  // Format date to "17 Agustus 2023"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch team details
  const fetchTeamDetails = async () => {
    try {
      const response = await apiPrivate.get(`/teams/${teamId}`);
      setTeamName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    }
  };

  // Fetch activity details
  const fetchActivityDetails = async () => {
    try {
      const response = await apiPrivate.get(`/activities/${activityId}`);
      setActivityName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };

  // Fetch sub-activity details
  const fetchSubActivityDetails = async () => {
    try {
      const response = await apiPrivate.get(`/sub-activities/${subActivityId}`);
      setSubActivityName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch sub-activity details:", error);
    }
  };

  // Fetch tasks
  const refetchTasks = async () => {
    if (!teamId || !activityId || !subActivityId) {
      console.error("Missing required parameters:", { teamId, activityId, subActivityId });
      return;
    }

    try {
      const response = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
    fetchActivityDetails();
    fetchSubActivityDetails();
    refetchTasks();
  }, [teamId, activityId, subActivityId]);

  const openModal = (type, taskId = null, name = "", date = "", link = "", deskripsi = "") => {
    setModalType(type);
    setCurrentTaskId(taskId);
    setTaskName(name);
    setDeskripsi(deskripsi);
    setDueDate(date ? new Date(date).toISOString().split("T")[0] : ""); // Converts to "YYYY-MM-DD"
    setLink(link || "");
    setIsModalOpen(true);
  };

  const openDeleteModal = (taskId) => {
    setCurrentTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentTaskId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTaskId(null);
    setTaskName("");
    setDueDate("");
    setLink("");
    setDeskripsi("");
  };

  const handleAddTask = async () => {
    if (!taskName || !dueDate) {
      alert("Please fill out all required fields.");
      return;
    }

    const newTask = {
      name: taskName,
      dateCreated: new Date().toISOString().split("T")[0],
      dueDate: dueDate || "Tidak ada",
      link: link || "#",
      deskripsi: deskripsi || "tidak ada",
      completed: false,
      created_by: auth.name, // Menggunakan nama pengguna yang sedang login
    };
    setLoading(true);

    try {
      await apiPrivate.post(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`, newTask);
      setTimeout(() => {
        refetchTasks();
        closeModal();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding task:", error.response || error.message);
      alert("Failed to add task. Please try again.");
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    if (!taskName || !dueDate) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedTask = {
      name: taskName,
      dueDate: dueDate, // Ensure this is correctly formatted as a string (e.g., "2024-08-27")
      link: link,
      deskripsi: deskripsi,
    };
    setLoading(true);

    try {
      const response = await apiPrivate.patch(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}`, updatedTask);
      setTimeout(() => {
        console.log("Updated Task Response:", response.data); // Check the server response
        refetchTasks();
        closeModal();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating task:", error);
      setLoading(false);
    }
  };

  const handleTaskCompletion = async (currentTaskId) => {
    try {
      await apiPrivate.patch(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}/completion`, {});
      refetchTasks();
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const deleteTask = async () => {
    try {
      await apiPrivate.delete(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}`);
      refetchTasks();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleSubActivityTasks = (teamId, activityId, subActivityId) => {
    setSubActivityTasks((prev) => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [activityId]: {
          ...(prev[teamId]?.[activityId] || {}),
          [subActivityId]: !prev[teamId]?.[activityId]?.[subActivityId],
        },
      },
    }));
  };

  const copyToClipboard = (text) => {
    if (text.trim()) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    } else {
      alert("No text to copy!");
    }
  };

  const progress = calculateProgress(tasks);
  const navigate = useNavigate();

  const archiveTask = async (teamId, activityId, subActivityId, taskId) => {
    // Implement archiving logic if applicable
    alert("Fitur arsip belum tersedia");
  };
  const formatLink = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      return `https://${link}`;
    }
    return link;
  };
  const filteredTasks = tasks.filter((task) => {
    const matchesName = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCreatedBy = task.created_by.toLowerCase().includes(createdByFilter.toLowerCase());
    const matchesDueDate = (!startDate || new Date(task.dueDate) >= new Date(startDate)) && (!endDate || new Date(task.dueDate) <= new Date(endDate));

    return matchesName && matchesCreatedBy && matchesDueDate;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const driveFolderUrl = linkDrive;

  const [uploadType, setUploadType] = useState("link");
  const [files, setFiles] = useState([]);

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="task-container">
      <div className="header" style={{ marginBottom: "10px", position: "relative" }}>
        {/* Bagian Back dan Tambah */}
        <ExploreBreadcrumb />

        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          {isMobile ? (
            <IconButton onClick={() => navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan`)} style={{ backgroundColor: "#007bff", color: "#ffffff", marginRight: "10px" }}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan`)}
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

          {isMobile ? <AddButton onClick={() => openModal("add")} text="Tambah " /> : <AddButton onClick={() => openModal("add")} text="Tambah Tugas " />}
        </div>

        {/* Bagian Drive */}
        <div style={{ position: "absolute", right: 0, top: "35px" }}>
          <DriveButton driveFolderUrl={driveFolderUrl} />
        </div>
      </div>

      <ProgressWrapper>
        <CircularProgress variant="determinate" value={progress} />
        <ProgressText>{Math.round(progress)}% Completed</ProgressText>
      </ProgressWrapper>
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap="16px" mb="16px">
          <TextField label="Search Task Name" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <TextField label="Search Created By" variant="outlined" value={createdByFilter} onChange={(e) => setCreatedByFilter(e.target.value)} />
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      ) : (
        <Box display="flex" gap="16px" mb="16px" mt="10px">
          <TextField label="Search Task Name" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <TextField label="Search Created By" variant="outlined" value={createdByFilter} onChange={(e) => setCreatedByFilter(e.target.value)} />
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      )}

      <div style={{ overflowX: "auto" }}>
        <TableContainer>
          <TaskTable isMobile={isMobile}>
            {isMobile ? (
              <thead></thead>
            ) : (
              <thead>
                <TableRow isMobile={isMobile}>
                  <TableHeader>No</TableHeader>
                  <TableHeader isMobile={isMobile}>Task</TableHeader>
                  <TableHeader isMobile={isMobile}>Deadline</TableHeader>
                  <TableHeader isMobile={isMobile}>Deskripsi</TableHeader>
                  <TableHeader isMobile={isMobile}>Link Drive</TableHeader>
                  {auth.role === "admin" && <TableHeader isMobile={isMobile}>Verified</TableHeader>}
                  <TableHeader isMobile={isMobile}>Actions</TableHeader>
                  <TableHeader isMobile={isMobile}>Dibuat Oleh</TableHeader>
                </TableRow>
              </thead>
            )}

            <tbody>
              {currentTasks.length ? (
                currentTasks.map((task, index) => (
                  <TableRow key={task.id} isMobile={isMobile}>
                    <TableCell data-label="No" isMobile={isMobile}>
                      {index + 1}
                    </TableCell>

                    <TableCell data-label="Task" isMobile={isMobile}>
                      {task.name}
                    </TableCell>
                    <TableCell data-label="Due Date" isMobile={isMobile}>
                      {formatDate(task.dueDate)}
                    </TableCell>
                    <TableCell data-label="Deskripsi" isMobile={isMobile}>
                      {task.deskripsi}
                    </TableCell>
                    <TableCell data-label="Link Drive" isMobile={isMobile} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <a href={formatLink(task.link)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
                        {task.link}
                      </a>
                      <ActionButton onClick={() => copyToClipboard(task.link)}>
                        <ContentCopyIcon />
                      </ActionButton>
                    </TableCell>
                    {auth.role === "admin" && (
                      <TableCell data-label="Verified" isMobile={isMobile}>
                        <ActionButton onClick={() => handleTaskCompletion(task.id)}>{task.completed ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}</ActionButton>
                      </TableCell>
                    )}
                    <TableCell data-label="Actions" isMobile={isMobile}>
                      <ActionButton onClick={() => openModal("edit", task.id, task.name, task.dueDate, task.link, task.deskripsi)}>
                        <EditIcon />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(task.id);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </ActionButton>
                    </TableCell>
                    <TableCell data-label="Dibuat Oleh" isMobile={isMobile}>
                      {task.created_by}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" isMobile={isMobile}>
                    No tasks available
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </TaskTable>
        </TableContainer>
      </div>

      {tasks.length > tasksPerPage && (
        <PaginationControls style={{ display: "flex", justifyContent: "flex-start" }}>
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ fontSize: "25px" }}>
            &lt;
          </Button>
          <Typography style={{ marginTop: "15px" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ fontSize: "25px" }}>
            &gt;
          </Button>
        </PaginationControls>
      )}
      {/* Modal for Add/Edit Task */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContent isMobile={isMobile}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <h2>{modalType === "add" ? "Add Task" : "Edit Task"}</h2>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label={
              <span>
                Task Name<span style={{ color: "red" }}> *</span>
              </span>
            }
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            margin="normal"
          />
          <TextField
            label={
              <span>
                Due Date<span style={{ color: "red" }}> *</span>
              </span>
            }
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={
              <span>
                Deskripsi<span style={{ color: "red" }}> *</span>
              </span>
            }
            fullWidth
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            margin="normal"
          />

          <Typography variant="h6" marginTop="16px">
            Upload Type
          </Typography>
          <RadioGroup value={uploadType} onChange={handleUploadTypeChange}>
            <FormControlLabel value="link" control={<Radio />} label="Link (Google Sheets, Google Docs, etc.)" />
            <FormControlLabel value="file" control={<Radio />} label="File (PDF, Image, Video, etc.)" />
          </RadioGroup>

          {uploadType === "link" ? (
            <TextField label="Link" fullWidth value={link} onChange={(e) => setLink(e.target.value)} margin="normal" />
          ) : (
            <>
              <Button variant="contained" component="label" fullWidth sx={{ marginTop: "16px" }}>
                Tambah File
                <input type="file" hidden onChange={handleFileUpload} multiple />
              </Button>
              <FileList>
                {files.map((file, index) => (
                  <FileListItem key={index}>
                    <Tooltip title={file.name}>
                      <FileName>{file.name}</FileName>
                    </Tooltip>
                    <IconButton onClick={() => handleFileRemove(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </FileListItem>
                ))}
              </FileList>
            </>
          )}

          <Box display="flex" justifyContent="flex-end" marginTop="16px">
            {modalType === "add" ? (
              <Button onClick={handleAddTask} variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : modalType === "add" ? "Tambah" : "Simpan"}
              </Button>
            ) : (
              <Button onClick={handleEditTask} variant="contained" color="primary">
                {loading ? <CircularProgress size={24} color="inherit" /> : modalType === "edit" ? "update" : "Simpan"}
              </Button>
            )}
          </Box>
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal isDeleteModalOpen={isDeleteModalOpen} closeDeleteModal={closeDeleteModal} deleteActivity={deleteTask} deleteItemName="Tugas" />
    </div>
  );
}

export default Tugas;
