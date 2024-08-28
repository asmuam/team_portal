import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';

const SubKegiatanBreadcrumbs = () => {
    const navigate = useNavigate();
    const { teamId, activityId } = useParams();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                Home
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/explorer")}>
                Team Hierarchy
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate(`/explorer/kegiatan/${teamId}`)}>
                Kegiatan
            </Link>
            <Typography color="text.primary">Sub-Kegiatan</Typography>
        </Breadcrumbs>
    );
};

export default SubKegiatanBreadcrumbs;
