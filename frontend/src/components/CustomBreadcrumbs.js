import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const CustomBreadcrumbs = () => {
    const navigate = useNavigate();

    const handleClick = (event, path) => {
        event.preventDefault();
        navigate(path);
    };

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link
                underline="hover"
                color="inherit"
                href="/"
                onClick={(e) => handleClick(e, '/')}
            >
                Home
            </Link>
            <Link
                underline="hover"
                color="inherit"
                href="/section"
                onClick={(e) => handleClick(e, '/section')}
            >
                Section
            </Link>
            <Typography color="text.primary">Current Page</Typography>
        </Breadcrumbs>
    );
};

export default CustomBreadcrumbs;
