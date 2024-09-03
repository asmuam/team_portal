import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Dummy data dengan username, role, dan tim
const dummyTeams = [
    { id: 1, name: "Team A" },
    { id: 2, name: "Team B" },
    { id: 3, name: "Team C" },
];

const dummyUsers = [
    { id: 1, username: "alice", role: "Admin", teams: [1, 2] },
    { id: 2, username: "bob", role: "User", teams: [2] },
    { id: 3, username: "charlie", role: "Guest", teams: [1, 3] },
];

const UserList = ({ onEditUser, onDeleteUser }) => {
    const getTeamNames = (teamIds) => {
        return teamIds.map(id => dummyTeams.find(team => team.id === id)?.name).join(", ");
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: "1px solid #ddd" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                            Username
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                            Role
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                            Team
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px", backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dummyUsers.map((user) => (
                        <TableRow key={user.id} hover sx={{ cursor: "pointer" }}>
                            <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                {user.username}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                {user.role}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                {getTeamNames(user.teams)}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => onEditUser(user)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => onDeleteUser(user)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;
