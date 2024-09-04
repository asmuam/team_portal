import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, TextField, MenuItem } from "@mui/material";
import UserList from "../components/userManagement/UserList";
import UserForm from "../components/userManagement/UserForm";
import useAxiosPrivate from "../hooks/use-axios-private.js";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const apiPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiPrivate.get(`/user`);
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

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle role filter change
  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesName && matchesRole;
  });

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mb: 2 }}>
        Tambah Pegawai
      </Button>

      {/* Search and Filter */}
      <Box display="flex" gap={2} mb={3}>
        <TextField label="Search by Name" variant="outlined" value={searchTerm} onChange={handleSearchChange} sx={{ flex: 1 }} />
        <TextField select label="Filter by Role" variant="outlined" value={roleFilter} onChange={handleRoleChange} sx={{ flex: 1 }}>
          <MenuItem value="">Semua </MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="pegawai">Pegawai</MenuItem>
        </TextField>
      </Box>

      <Box>
        <UserList users={filteredUsers} onEditUser={handleEditUser} refreshUsers={handleRefreshUsers} />
      </Box>
      {isFormOpen && <UserForm user={selectedUser} onClose={handleCloseForm} refreshUsers={handleRefreshUsers} />}
    </Container>
  );
};

export default UserManagement;
