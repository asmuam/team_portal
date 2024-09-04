import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, IconButton, Box, Tooltip, Button } from "@mui/material";
import { Edit, Delete, Archive } from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Component for Card
const StyledCard = styled(Card)(() => ({
  width: "100%",
  maxWidth: "340px",
  marginTop: "20px",
  cursor: "pointer",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "2",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  maxHeight: "150px", // Initial height to show truncated content
  "&:hover": {
    boxShadow: "8",
    transform: "translateY(-5px)",
    maxHeight: "500px", // Expanded height on hover to show full content
  },
}));

// Styled Component for the Icon Container
const IconContainer = styled(Box)(() => ({
  position: "absolute",
  top: "8px",
  right: "8px",
  display: "none", // Hidden by default
  "& .MuiIconButton-root": {
    color: "#fff",
    backgroundColor: "#000",
    margin: "0 2px",
    "&:hover": {
      backgroundColor: "#333",
    },
  },
  ".MuiCard-root:hover &": {
    display: "flex", // Show icons on hover
  },
}));

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

const PaginationControls = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
}));

const SubActivityList = ({ activities, onActivityClick, onEditClick, onDeleteClick, onArchiveClick, tasksPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(activities.length / tasksPerPage);

  // Calculate the activities to display for the current page
  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentActivities = activities.slice(startIndex, startIndex + tasksPerPage);
  return (
    <>
      <Grid container spacing={3} className="activity-list">
        {currentActivities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
            <StyledCard onClick={() => onActivityClick(activity.id, activity.link_drive)}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#212121",
                  }}
                >
                  {activity.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#757575",
                    marginBottom: "8px",
                  }}
                >
                  {new Date(activity.tanggal_pelaksanaan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </Typography>
                <DescriptionBox
                  variant="body2"
                  sx={{
                    color: "#757575",
                  }}
                >
                  {activity.deskripsi}
                </DescriptionBox>
              </CardContent>
              <IconContainer>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent unwanted navigation
                      onEditClick(activity.id, activity.name, activity.tanggal_pelaksanaan, activity.deskripsi);
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
                      onDeleteClick(activity.id);
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
                      onArchiveClick(activity.id);
                    }}
                  >
                    <Archive />
                  </IconButton>
                </Tooltip>
              </IconContainer>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {activities.length > tasksPerPage && (
        <PaginationControls>
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ fontSize: "25px" }}>
            &lt;
          </Button>
          <Typography sx={{ margin: "0 15px" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ fontSize: "25px" }}>
            &gt;
          </Button>
        </PaginationControls>
      )}
    </>
  );
};

export default SubActivityList;
