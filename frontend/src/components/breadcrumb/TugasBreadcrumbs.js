import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';

const TugasBreadcrumbs = () => {
    const navigate = useNavigate();
    const { teamId, activityId, subActivityId } = useParams();

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
            <Link underline="hover" color="inherit" onClick={() => navigate(`/explorer/kegiatan/${teamId}/subkegiatan/${activityId}`)}>
                Sub-Kegiatan
            </Link>
            <Typography color="text.primary">Tugas</Typography>
        </Breadcrumbs>
    );
};

export default TugasBreadcrumbs;
