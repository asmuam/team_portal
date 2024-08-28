import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const TeamHierarchyBreadcrumbs = () => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                Home
            </Link>
            <Typography color="text.primary">Team Hierarchy</Typography>
        </Breadcrumbs>
    );
};

export default TeamHierarchyBreadcrumbs;
