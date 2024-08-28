import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Modal, TextField, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import TugasBreadcrumbs from "./breadcrumb/TugasBreadcrumbs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

const TaskTable = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
});

const TableHeader = styled("th")({
  borderBottom: "2px solid #333",
  padding: "10px",
  textAlign: "left",
});

const TableCell = styled("td")({
  borderBottom: "1px solid #ddd",
  padding: "10px",
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

const AddTaskButton = styled(IconButton)({
  marginBottom: "16px",
});

function Tugas() {
  const { teamId, activityId, subActivityId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [link, setLink] = useState("");
  const [teamName, setTeamName] = useState("");
  const [activityName, setActivityName] = useState("");
  const [subActivityName, setSubActivityName] = useState("");
  const [subActivityTasks, setSubActivityTasks] = useState({});

  const URL = process.env.REACT_APP_API_URL;

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

  // Fetch team details
  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`${URL}/teams/${teamId}`);
      setTeamName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    }
  };

  // Fetch activity details
  const fetchActivityDetails = async () => {
    try {
      const response = await axios.get(`${URL}/activities/${activityId}`);
      setActivityName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };

  // Fetch sub-activity details
  const fetchSubActivityDetails = async () => {
    try {
      const response = await axios.get(`${URL}/sub-activities/${subActivityId}`);
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
      const response = await axios.get(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`);
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

  const openModal = (type, taskId = null, name = "", date = "", link = "") => {
    setModalType(type);
    setCurrentTaskId(taskId);
    setTaskName(name);
    setDueDate(date ? new Date(date).toISOString().split("T")[0] : ""); // Converts to "YYYY-MM-DD"
    setLink(link || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTaskId(null);
    setTaskName("");
    setDueDate("");
    setLink("");
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
      completed: false,
    };

    try {
      await axios.post(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`, newTask);
      refetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error.response || error.message);
      alert("Failed to add task. Please try again.");
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
    };

    try {
      const response = await axios.patch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}`, updatedTask);
      console.log("Updated Task Response:", response.data); // Check the server response
      refetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskCompletion = async (currentTaskId) => {
    try {
      await axios.patch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}/completion`, {});
      refetchTasks();
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}`);
      refetchTasks();
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
    alert("Fitur arsip belum tersedia")
  };
  const formatLink = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      return `https://${link}`;
    }
    return link;
  };

  return (
    <div className="task-container">
      <TugasBreadcrumbs />
      <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/explorer/kegiatan/${teamId}/subkegiatan/${activityId}`)}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 600,
            padding: '10px 20px',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            backgroundColor: '#007bff',  // Set a primary color for consistency
            color: '#ffffff',  // Ensure text color is visible on the background
            '&:hover': {
              backgroundColor: '#0056b3',
              boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
            },
            '&:active': {
              backgroundColor: '#004494',
              transform: 'scale(0.98)',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(38, 143, 255, 0.5)',
            },
            marginRight: '10px',  // Add margin to the right for spacing
          }}
      >
        Back
      </Button>
      <Button
          variant="contained"
          color="primary"
          onClick={() => openModal("add")}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 600,
            padding: '10px 20px',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#0056b3',
              boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
            },
            '&:active': {
              backgroundColor: '#004494',
              transform: 'scale(0.98)',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(38, 143, 255, 0.5)',
            },
          }}
      >
        Tambah Tugas Baru
      </Button>
      <ProgressWrapper>
        <CircularProgress variant="determinate" value={progress} />
        <ProgressText>{Math.round(progress)}% Completed</ProgressText>
      </ProgressWrapper>
      <TaskTable>
        <thead>
          <tr>
            <TableHeader>Task</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Link</TableHeader>
            <TableHeader>Verified</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{formatDate(task.dueDate)}</TableCell>
              <TableCell
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                {/* <TextField type="text" value={task.link} /> */}
                <a
                  href={formatLink(task.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}
                >
                  {task.link}
                </a>
                {/* <ActionButton onClick={() => copyToClipboard(task.link)}>
                  <ContentCopyIcon />
                </ActionButton> */}
              </TableCell>
              <TableCell>
                <ActionButton onClick={() => handleTaskCompletion(task.id)}>
                  {task.completed ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                </ActionButton>
              </TableCell>
              <TableCell>
                <ActionButton onClick={() => openModal("edit", task.id, task.name, task.dueDate, task.link)}>
                  <EditIcon />
                </ActionButton>
                <ActionButton onClick={() => deleteTask(task.id)}>
                  <DeleteIcon color="error" />
                </ActionButton>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </TaskTable>

      {/* Modal for Add/Edit Task */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <h2>{modalType === "add" ? "Add Task" : "Edit Task"}</h2>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField label="Task Name" fullWidth value={taskName} onChange={(e) => setTaskName(e.target.value)} margin="normal" />
          <TextField label="Due Date" type="date" fullWidth value={dueDate} onChange={(e) => setDueDate(e.target.value)} margin="normal" InputLabelProps={{
            shrink: true,  // Ini memastikan label selalu berada di posisi atas
          }}/>
          <TextField label="Link" fullWidth value={link} onChange={(e) => setLink(e.target.value)} margin="normal" />
          <Box display="flex" justifyContent="flex-end" marginTop="16px">
            {modalType === "add" ? (
              <Button onClick={handleAddTask} variant="contained" color="primary">
                Add Task
              </Button>
            ) : (
              <Button onClick={handleEditTask} variant="contained" color="primary">
                Update Task
              </Button>
            )}
          </Box>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Tugas;
