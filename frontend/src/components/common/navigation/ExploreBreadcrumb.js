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
        console.log('Fetching data for breadcrumb...');
        const fetchData = async () => {
            try {
                // Fetch team by teamId
                if (teamId) {
                    const teamsResponse = await apiPrivate.get(`/teams`);
                    const team = teamsResponse.data.find(team => team.id === parseInt(teamId));
                    if (team) {
                        setData(prev => ({ ...prev, teamName: team.name }));
                    }

                    // Fetch activities if teamId is available
                    if (activityId) {
                        const activitiesResponse = await apiPrivate.get(`/teams/${teamId}/activities`);
                        const activity = activitiesResponse.data.find(activity => activity.id === parseInt(activityId));
                        if (activity) {
                            setData(prev => ({ ...prev, activityName: activity.name }));

                            // Fetch sub-activities if activityId is available
                            if (subActivityId) {
                                const subActivitiesResponse = await apiPrivate.get(`/teams/${teamId}/activities/${activityId}/sub-activities`);
                                const subActivity = subActivitiesResponse.data.find(sub => sub.id === parseInt(subActivityId));
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
    }, [teamId, activityId, subActivityId]);

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
