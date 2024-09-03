import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import useAxiosPrivate from "../../hooks/use-axios-private";

const roles = ["admin", "pegawai"];

const UserForm = ({ user, onClose, refreshUsers }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const apiPrivate = useAxiosPrivate();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setName(user.name);
      setPassword(user.password); // Do not prefill password for security reasons
      setRole(user.role);
    } else {
      setUsername("");
      setPassword("");
      setName("");
      setRole("");
    }
  }, [user]);

  const handleSubmit = async () => {
    const userData = { username, role, name };
    if (password) {
      userData.password = password;
    }

    try {
      if (user) {
        await apiPrivate.patch(`/user/${user.id}`, userData);
      } else {
        await apiPrivate.post(`/user`, userData);
      }
      await refreshUsers(); // Refresh the list after updating
      onClose();
    } catch (error) {
      console.error("There was an error saving the user:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Username" fullWidth variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField autoFocus margin="dense" label="Name" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField margin="dense" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role">
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
