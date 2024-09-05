import React, { useContext } from "react";
import { Grid, Card, CardContent, Typography, IconButton, Box, Tooltip } from "@mui/material";
import { Edit, Delete, Archive } from "@mui/icons-material";
import { styled } from "@mui/system";
import AuthContext from "../../../context/AuthContext.js";

// Styled Component for Card (similar to ActivityList)
const StyledCard = styled(Card)(() => ({
  marginTop: "20px",
  cursor: "pointer",
  transition: "0.3s",
  border: "1px solid #e0e0e0", // Light gray border
  borderRadius: 3, // Rounded corners
  boxShadow: 2, // Light shadow
  position: "relative", // Ensure positioning context for absolute elements
  maxHeight: "150px", // Initial height to show truncated content
  "&:hover": {
    boxShadow: 8, // Enhanced shadow on hover
    transform: "translateY(-5px)", // Slight lift effect
    maxHeight: "500px", // Expanded height on hover to show full content
  },
}));

// Styled Component for the Icon Container
const IconContainer = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  p: 1,
  display: "flex",
  gap: 1,
  backgroundColor: "background.paper",
  borderTopLeftRadius: 2,
  borderBottomRightRadius: 3,
  display: "none", // Hidden by default
  ".MuiCard-root:hover &": {
    display: "flex", // Show icons on hover
  },
}));

// Styled Component for the DescriptionBox (same as ActivityList)
const DescriptionBox = styled(Typography)(() => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "all 0.3s ease-in-out",
  ".MuiCard-root:hover &": {
    whiteSpace: "normal", // Allow multiline text on hover
    overflow: "visible",
    textOverflow: "clip",
  },
}));

const TeamList = ({ teams, handleTeamClick, deleteTeam, archiveTeam, openModal }) => {
  const { auth } = useContext(AuthContext);

  return (
    <Grid container spacing={3} className="team-list">
      {teams.map((team) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
          <StyledCard onClick={(e) => handleTeamClick(e, team.id, team.link_drive)}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {team.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ketua: {team.leader.name}
              </Typography>
              <DescriptionBox variant="body2" color="textSecondary">
                Deskripsi: {team.deskripsi}
              </DescriptionBox>
            </CardContent>

            {auth.role === "admin" && (
              <IconContainer>
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
              </IconContainer>
            )}
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamList;
