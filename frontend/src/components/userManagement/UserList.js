import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Button, Pagination } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const UserList = ({ users = [], onEditUser, refreshUsers }) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const URL = process.env.REACT_APP_API_URL;

  const usersPerPage = 5;
  const pageCount = Math.ceil(users.length / usersPerPage);

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${URL}/user/${selectedUser.id}`);
      setOpen(false);
      await refreshUsers(); // Refresh the list after deleting
    } catch (error) {
      console.error("There was an error deleting the user:", error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedUsers = users.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover sx={{ cursor: "pointer" }}>
                  <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{user.username}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{user.name}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>{user.role}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteUser(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pageCount > 1 && <Pagination count={pageCount} page={page} onChange={handleChangePage} sx={{ marginTop: 2, display: "flex", justifyContent: "center" }} />}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
