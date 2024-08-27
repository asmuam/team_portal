import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, IconButton, Modal, TextField } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

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

const TaskBox = styled(Box)({
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

const TaskName = styled(Typography)({
  fontSize: "1.5em",
  fontWeight: 900,
  marginBottom: "10px",
});

const TaskActions = styled(Box)({
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

function Tugas({ teamId, activityId, subActivityId }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Type of the modal ("add" or "edit")
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [link, setLink] = useState("");

  const URL = process.env.REACT_APP_API_URL;

  const openModal = (type, taskId = null, name = "", date = "", link = "") => {
    setModalType(type);
    setCurrentTaskId(taskId);
    setTaskName(name);
    setDueDate(date ? new Date(date).toISOString().split("T")[0] : "");
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

  const refetchTasks = async () => {
    try {
      const response = await axios.get(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    if (subActivityId) {
      refetchTasks();
    }
  }, [subActivityId]);

  const handleAddTask = async () => {
    if (!taskName || !dueDate) {
      alert("Please fill out all required fields.");
      return;
    }

    const newTask = {
      name: taskName,
      dateCreated: new Date().toISOString().split("T")[0], // Format ISO string
      dueDate: dueDate || "Tidak ada", // Pastikan format tanggal benar
      link: link || "#", // Default jika link kosong
      completed: false, // Status awal tugas
    };

    console.log("Sending task data:", newTask); // Debugging log

    try {
      const response = await axios.post(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`, newTask);
      console.log("Task added successfully:", response.data);
      refetchTasks(); // Refresh data
      closeModal(); // Tutup modal setelah menambahkan tugas
    } catch (error) {
      console.error("Error adding task:", error.response || error.message);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
      }
      alert("Failed to add task. Please try again.");
    }
  };

  const handleEditTask = async () => {
    if (!taskName) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedTask = {
      name: taskName,
      newDeadline: dueDate,
      newLink: link,
    };

    try {
      await axios.patch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${currentTaskId}`, updatedTask);
      refetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      modalType === "add" ? handleAddTask() : handleEditTask();
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

  const toggleCompletion = async (taskId) => {
    try {
      await axios.patch(`${URL}/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/completion`);
      refetchTasks();
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleTaskClick = (taskId) => {
    console.log(`Task ${taskId} clicked`);
  };

  return (
    <div className="task-container">
      <h1>Detail Tugas</h1>

      <div className="header" style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={() => openModal("add")}>
          Tambah Tugas
        </Button>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} style={{ marginBottom: "20px;" }}>
              <TaskBox onClick={() => handleTaskClick(task.id)}>
                <TaskName>{task.name}</TaskName>
                <Typography variant="body2" color="textSecondary">
                  Due Date: {new Date(task.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </Typography>
                <TaskActions>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("edit", task.id, task.name, task.dueDate, task.link);
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
                      deleteTask(task.id);
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
                      toggleCompletion(task.id);
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
                    <span>&#10003;</span> {/* Toggle completion icon */}
                  </IconButton>
                </TaskActions>
              </TaskBox>
            </div>
          ))
        ) : (
          <Typography variant="h6">No tasks available</Typography>
        )}
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <Header variant="h6">
            {modalType === "add" ? "Tambah Tugas" : "Edit Tugas"}
            <IconButton style={{ position: "absolute", right: "16px", top: "16px" }} onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Header>
          <InputField label="Task Name" variant="outlined" value={taskName} onChange={(e) => setTaskName(e.target.value)} onKeyPress={handleKeyPress} />
          <InputField label="Due Date" type="date" variant="outlined" value={dueDate} onChange={(e) => setDueDate(e.target.value)} onKeyPress={handleKeyPress} />
          <InputField label="Link" variant="outlined" value={link} onChange={(e) => setLink(e.target.value)} onKeyPress={handleKeyPress} />
          <Button variant="contained" color="primary" onClick={modalType === "add" ? handleAddTask : handleEditTask} onKeyPress={handleKeyPress}>
            {modalType === "add" ? "Add Task" : "Update Task"}
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Tugas;
