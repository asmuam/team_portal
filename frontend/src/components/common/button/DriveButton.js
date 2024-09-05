import React from "react";
import Button from "@mui/material/Button";
import { FaGoogleDrive } from "react-icons/fa"; // Import Google Drive icon
import useMediaQuery from "@mui/material/useMediaQuery";

const DriveButton = ({ driveFolderUrl }) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // Check if the screen width is less than 600px

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={isMobile ? <FaGoogleDrive /> : null} // Show Google Drive icon only on mobile
      href={driveFolderUrl}
      target="_blank" // Opens the link in a new tab
      rel="noopener noreferrer" // Security best practice
      sx={{
        borderRadius: "6px",
        fontSize: isMobile ? "0px" : "16px", // Hide text on mobile
        fontWeight: 600,
        padding: "10px 20px",
        textTransform: "none",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#0056b3",
          boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
        },
        "&:active": {
          backgroundColor: "#004494",
          transform: "scale(0.98)",
        },
        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 3px rgba(38, 143, 255, 0.5)",
        }, // Add margin to the right for spacing
      }}
    >
      {isMobile ? "" : "Buka Drive"}
    </Button>
  );
};

export default DriveButton;
