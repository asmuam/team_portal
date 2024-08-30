import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, text }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            startIcon={<AddIcon />}
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
            }}
        >
            {text}
        </Button>
    );
};

export default AddButton;
