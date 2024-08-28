import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';

const KegiatanBreadcrumbs = () => {
    const navigate = useNavigate();
    const { teamId } = useParams();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                Home
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/explorer")}>
                Team Hierarchy
            </Link>
            <Typography color="text.primary">Kegiatan</Typography>
        </Breadcrumbs>
    );
};

export default KegiatanBreadcrumbs;
