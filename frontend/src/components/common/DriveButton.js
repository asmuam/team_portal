import React from 'react';
import Button from '@mui/material/Button';
import FolderOpen from '@mui/icons-material/FolderOpen'; // Example icon

const DriveButton = ({ driveFolderUrl }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<FolderOpen />}
            href={driveFolderUrl}
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security best practice
            sx={{
                borderRadius: "6px",
                fontSize: "16px",
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
                },
                marginRight: "10px", // Add margin to the right for spacing
            }}
        >
            Buka Drive
        </Button>
    );
};

export default DriveButton;
