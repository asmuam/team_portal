import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import UserList from "../components/userManagement/UserList";
import UserForm from "../components/userManagement/UserForm";
import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${URL}/user`);
      setUsers(response.data);
    } catch (error) {
      console.error("There was an error fetching the users:", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleRefreshUsers = async () => {
    console.log("Refreshing users...");
    await fetchUsers();
  };

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mb: 2 }}>
        Tambah User
      </Button>
      <Box>
        <UserList users={users} onEditUser={handleEditUser} refreshUsers={handleRefreshUsers} />
      </Box>
      {isFormOpen && <UserForm user={selectedUser} onClose={handleCloseForm} refreshUsers={handleRefreshUsers} />}
    </Container>
  );
};

export default UserManagement;
