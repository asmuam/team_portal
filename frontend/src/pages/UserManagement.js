import React, { useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import UserList from "../components/userManagement/UserList";
import UserForm from "../components/userManagement/UserForm";

const UserManagement = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

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

    return (
        <Container sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
                sx={{ mb: 2 }}
            >
                Add User
            </Button>
            <Box>
                <UserList onEditUser={handleEditUser} />
            </Box>
            {isFormOpen && (
                <UserForm
                    user={selectedUser}
                    onClose={handleCloseForm}
                />
            )}
        </Container>
    );
};

export default UserManagement;
