import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from "./../../../hooks/use-axios-private";

const ExploreBreadcrumb = () => {
    const navigate = useNavigate();
    const { teamId, activityId, subActivityId } = useParams();
    const [data, setData] = useState({
        teamName: '',
        activityName: '',
        subActivityName: ''
    });
    const apiPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch team by teamId
                if (teamId) {
                    const teamResponse = await apiPrivate.get(`/teams/${teamId}`);
                    const team = teamResponse.data;
                    if (team) {
                        setData(prev => ({ ...prev, teamName: team.name }));
                    }

                    // Fetch activity by activityId if available
                    if (activityId) {
                        const activityResponse = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}`);
                        const activity = activityResponse.data;
                        if (activity) {
                            setData(prev => ({ ...prev, activityName: activity.name }));

                            // Fetch sub-activity by subActivityId if available
                            if (subActivityId) {
                                const subActivityResponse = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}`);
                                const subActivity = subActivityResponse.data;
                                if (subActivity) {
                                    setData(prev => ({ ...prev, subActivityName: subActivity.name }));
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [teamId, activityId, subActivityId, apiPrivate]);

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate("/explorer")}>
                Home
            </Link>
            {data.teamName && (
                <Link underline="hover" color="inherit" onClick={() => navigate(`/explorer/team/${teamId}/kegiatan`)}>
                    {data.teamName}
                </Link>
            )}
            {data.activityName && (
                <Link underline="hover" color="inherit" onClick={() => navigate(`/explorer/team/${teamId}/kegiatan/${activityId}/subkegiatan`)}>
                    {data.activityName}
                </Link>
            )}
            {data.subActivityName && (
                <Typography color="text.primary">{data.subActivityName}</Typography>
            )}
        </Breadcrumbs>
    );
};

export default ExploreBreadcrumb;
