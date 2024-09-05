import React, { useContext } from "react";
import { Grid, Card, CardContent, Typography, IconButton, Box, Tooltip } from "@mui/material";
import { Edit, Delete, Archive } from "@mui/icons-material";
import AuthContext from "../../../context/AuthContext.js";

const TeamList = ({ teams, handleTeamClick, deleteTeam, archiveTeam, openModal }) => {
  const { auth } = useContext(AuthContext);

  return (
    <Grid container spacing={3} className="team-list">
      {teams.map((team) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
          <Card
            onClick={(e) => handleTeamClick(e, team.id, team.link_drive)}
            sx={{
              marginTop: "20px",
              cursor: "pointer",
              transition: "0.3s",
              border: "1px solid #e0e0e0", // Light gray border
              borderRadius: 3, // Rounded corners
              boxShadow: 2, // Light shadow
              position: "relative", // Ensure positioning context for absolute elements
              "&:hover": {
                boxShadow: 8, // Enhanced shadow on hover
                transform: "translateY(-5px)", // Slight lift effect
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {team.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ketua: {team.leader.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Deskripsi: {team.deskripsi}
              </Typography>
            </CardContent>
            {auth.role === "admin" && ( // Only show icons if the user is an admin
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  p: 1,
                  display: "flex",
                  gap: 1,
                  backgroundColor: "background.paper", // Card background color
                  borderTopLeftRadius: 2, // Rounded top-left corner
                  borderBottomRightRadius: 3, // Rounded bottom-right corner
                  overflow: "hidden", // Ensure contents do not overflow card
                }}
              >
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unwanted navigation
                      openModal("edit", team.id, team.name, team.leader.id, team.deskripsi);
                    }}
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        color: "primary.dark",
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unwanted navigation
                      deleteTeam(team.id);
                    }}
                    sx={{
                      color: "error.main",
                      "&:hover": {
                        color: "error.dark",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Archive">
                  <IconButton
                    aria-label="archive"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unwanted navigation
                      archiveTeam(e, team.id);
                    }}
                    sx={{
                      color: "warning.main",
                      "&:hover": {
                        color: "warning.dark",
                      },
                    }}
                  >
                    <Archive />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamList;
