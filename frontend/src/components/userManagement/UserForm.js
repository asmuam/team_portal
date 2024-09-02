import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const roles = ["Admin", "User", "Guest"]; // Daftar peran pengguna

const UserForm = ({ user, onClose }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPassword(""); // Do not prefill password for security reasons
            setRole(user.role);
        } else {
            setUsername("");
            setPassword("");
            setRole("");
        }
    }, [user]);

    const handleSubmit = () => {
        const userData = user
            ? { ...user, username, role } // Password should not be updated this way
            : { id: Date.now(), username, password, role };
        console.log(userData);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {user ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;
