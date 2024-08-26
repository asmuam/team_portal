import React, { useState } from 'react';
import axios from 'axios'
import './TeamHierarchy.css';

function TeamHierarchy({ teams, setTeams }) {
    const [activeTeams, setActiveTeams] = useState([]);
    const [activeActivities, setActiveActivities] = useState([]);
    const [subActivityTasks, setSubActivityTasks] = useState({});

    const URL = process.env.REACT_APP_API_URL

    const refetchTeams = async () => {
        try {
            const response = await fetch(`${URL}/team`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
        }
    };

    const toggleTeamActivities = (id) => {
        setActiveTeams(prevState =>
            prevState.includes(id) ? prevState.filter(teamId => teamId !== id) : [...prevState, id]
        );
    };

    const toggleActivitySubActivities = (teamId, Id) => {
        setActiveActivities(prevState => {
            // Create a new set of active activities
            const newActiveActivities = new Set(prevState);

            if (newActiveActivities.has(Id)) {
                // If the activity is already active, remove it
                newActiveActivities.delete(Id);
            } else {
                // Otherwise, add it to the set
                newActiveActivities.add(Id);
            }

            return Array.from(newActiveActivities);
        });
    };


    const toggleSubActivityTasks = (teamId, activityId, subActivityId) => {
        setSubActivityTasks(prevState => ({
            ...prevState,
            [teamId]: {
                ...(prevState[teamId] || {}),
                [activityId]: {
                    ...(prevState[teamId]?.[activityId] || {}),
                    [subActivityId]: prevState[teamId]?.[activityId]?.[subActivityId] ? null : true
                }
            }
        }));
    };

    const addTeam = async () => {
        const newTeamName = prompt('Masukkan nama tim baru:');
        if (newTeamName) {
            try {
                await axios.post(`${URL}/team`, { name: newTeamName });
                refetchTeams();
            } catch (error) {
                console.error('Error adding team:', error);
            }
        }
    };

    const renameTeam = async (id) => {
        const newName = prompt('Masukkan nama baru:');
        if (newName) {
            try {
                await axios.patch(`${URL}/team/${id}`, { name: newName });
                refetchTeams();
            } catch (error) {
                console.error('Error renaming team:', error);
            }
        }
    };

    const deleteTeam = async (id) => {
        try {
            await axios.delete(`${URL}/team/${id}`);
            refetchTeams();
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    const archiveTeam = async (id) => {
        // Implement archiving logic if applicable
        alert(`Tim Kerja ${teams.find(team => team.id === id).name} telah diarsipkan.`);
    };

    const addActivity = async (teamId) => {
        const newActivity = prompt('Masukkan nama kegiatan baru:');
        if (newActivity) {
            try {
                await axios.post(`${URL}/team/${teamId}/activities`, { name: newActivity });
                refetchTeams();
            } catch (error) {
                console.error('Error adding activity:', error);
            }
        }
    };

    const renameActivity = async (teamId, Id) => {
        const newName = prompt('Masukkan nama kegiatan baru:');
        if (newName) {
            try {
                await axios.patch(`${URL}/team/${teamId}/activities/${Id}`, { name: newName });
                refetchTeams();
            } catch (error) {
                console.error('Error renaming activity:', error);
            }
        }
    };

    const deleteActivity = async (teamId, Id) => {
        try {
            await axios.delete(`${URL}/team/${teamId}/activities/${Id}`);
            refetchTeams();
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    const archiveActivity = async (teamId, Id) => {
        // Implement archiving logic if applicable
        alert(`Kegiatan ${teams.find(team => team.id === teamId).activities[Id].name} telah diarsipkan.`);
    };

    const addSubActivity = async (teamId, activityId) => {
        const newSubActivity = prompt('Masukkan nama sub-kegiatan baru:');
        if (newSubActivity) {
            try {
                await axios.post(`${URL}/team/${teamId}/activities/${activityId}/sub-activities`, { name: newSubActivity });
                refetchTeams();
            } catch (error) {
                console.error('Error adding sub-activity:', error);
            }
        }
    };

    const renameSubActivity = async (teamId, activityId, subActivityId) => {
        const newName = prompt('Masukkan nama sub-kegiatan baru:');
        if (newName) {
            try {
                await axios.patch(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}`, { name: newName });
                refetchTeams();
            } catch (error) {
                console.error('Error renaming sub-activity:', error);
            }
        }
    };

    const deleteSubActivity = async (teamId, activityId, subActivityId) => {
        try {
            await axios.delete(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}`);
            refetchTeams();
        } catch (error) {
            console.error('Error deleting sub-activity:', error);
        }
    };

    const archiveSubActivity = async (teamId, activityId, subActivityId) => {
        // Implement archiving logic if applicable
        alert(`Sub-Kegiatan ${teams.find(team => team.id === teamId).activities[activityId].subActivities[subActivityId].name} telah diarsipkan.`);
    };

    const addTask = async (teamId, activityId, subActivityId) => {
        const newTaskName = prompt('Masukkan nama tugas baru:');
        const dueDate = prompt('Masukkan deadline tugas (YYYY-MM-DD):');
        const link = prompt('Masukkan link (bukti dukung):');

        if (newTaskName) {
            const newTask = {
                name: newTaskName,
                dateCreated: new Date().toISOString().split('T')[0],
                dueDate: dueDate || 'Tidak ada',
                link: link || '#',
                completed: false
            };
            try {
                await axios.post(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`, newTask);
                refetchTeams();
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const renameTask = async (teamId, activityId, subActivityId, taskId, currentName) => {
        const newName = prompt('Masukkan nama tugas baru:', currentName);
        if (newName) {
            try {
                await axios.patch(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}`, { name: newName });
                refetchTeams();
            } catch (error) {
                console.error('Error renaming task:', error);
            }
        }
    };

    const deleteTask = async (teamId, activityId, subActivityId, taskId) => {
        try {
            await axios.delete(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}`);
            refetchTeams();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const archiveTask = async (teamId, activityId, subActivityId, taskId) => {
        // Implement archiving logic if applicable
        alert(`Tugas ${teams.find(team => team.id === teamId).activities[activityId].subActivities[subActivityId].tasks[taskId].name} telah diarsipkan.`);
    };

    const toggleTaskCompletion = async (teamId, activityId, subActivityId, taskId) => {
        try {
            await axios.patch(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/completion`, {});
            refetchTeams();
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    const handleDeadlineChange = async (teamId, activityId, subActivityId, taskId, newDeadline) => {
        try {
            await axios.patch(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/deadline`, { dueDate: newDeadline });
            refetchTeams();
        } catch (error) {
            console.error('Error updating task deadline:', error);
        }
    };

    const handleLinkChange = async (newLink, teamId, activityId, subActivityId, taskId) => {
        try {
            await axios.patch(`${URL}/team/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/link`, { newLink: newLink });
            refetchTeams();
        } catch (error) {
            console.error('Error updating task drive link:', error);
        }
    };

    const calculateTaskStatus = (dueDate, dateUpload) => {
        const due = new Date(dueDate);
        const upload = new Date(dateUpload);

        return upload > due ? 'terlambat' : 'tepat waktu';
    };

    const calculateProgress = (tasks) => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    };

    const copyToClipboard = (text) => {
        if (text.trim()) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        } else {
            alert('No text to copy!');
        }
    };

    if (!Array.isArray(teams)) {
        return <p>No teams available.</p>;  // Or handle the error gracefully
    }
    return (
        <div className="team-hierarchy">
            <div className="team-list">
                {teams.map(team => (
                    <div className="team-container" key={team.id}>
                        <div className="team-box" onClick={() => toggleTeamActivities(team.id)}>
                            <div className="team-name">{team.name}</div>
                            <div className="team-actions">
                                <span onClick={() => renameTeam(team.id)}>&#9998;</span>
                                <span onClick={() => deleteTeam(team.id)}>&#10006;</span>
                                <span onClick={() => archiveTeam(team.id)}>&#128229;</span>
                            </div>
                        </div>
                        {activeTeams.includes(team.id) && (
                            <div className="activities-content">
                                {(team.activities).map((activity) => (
                                    <div className='activity-container' key={activity.Id}>
                                        <div className="activity-box" onClick={() => toggleActivitySubActivities(team.id, activity.id)}>
                                            <div className="activity-name">{activity.name}</div>
                                            <div className="activity-actions">
                                                <span onClick={() => renameActivity(team.id, activity.id)}>&#9998;</span>
                                                <span onClick={() => deleteActivity(team.id, activity.id)}>&#10006;</span>
                                                <span onClick={() => archiveActivity(team.id, activity.id)}>&#128229;</span>
                                            </div>
                                        </div>
                                        {activeActivities.includes(activity.id) && (
                                            <div className="sub-activities-content">
                                                {(activity.subActivities).map((subActivity) => {
                                                    const progress = calculateProgress(subActivity.tasks || []);
                                                    return (
                                                        <div className='sub-activity-container' key={subActivity.id}>
                                                            <div className="sub-activity-box" onClick={() => toggleSubActivityTasks(team.id, activity.id, subActivity.id)}>
                                                                <div className="sub-activity-name">
                                                                    {subActivity.name}
                                                                </div>
                                                                <div className="progress-status">
                                                                    {subActivity.tasks.length === 0 ? 'Belum ada tugas' : `Progress: ${progress.toFixed(2)}%`}
                                                                </div>
                                                                <div className="sub-activity-actions">
                                                                    <span onClick={() => renameSubActivity(team.id, activity.id, subActivity.id)}>&#9998;</span>
                                                                    <span onClick={() => deleteSubActivity(team.id, activity.id, subActivity.id)}>&#10006;</span>
                                                                    <span onClick={() => archiveSubActivity(team.id, activity.id, subActivity.id)}>&#128229;</span>
                                                                </div>
                                                            </div>
                                                            {subActivityTasks[team.id]?.[activity.id]?.[subActivity.id] && (
                                                                <div className="tasks-content">
                                                                    {(subActivity.tasks).map((task) => (
                                                                        <div className='task-container' key={task.id}>
                                                                            <div className="task-details">
                                                                                <div className="task-name">{task.name}</div>
                                                                                <div className="task-meta">
                                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                                                        <span>Date Created: </span>
                                                                                        <span>{task.dateCreated}</span>
                                                                                    </div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                                                            <span>Deadline:</span>
                                                                                            <span style={{ color: 'red' }}>{task.dueDate}</span>
                                                                                        </div>
                                                                                        <span
                                                                                            onClick={() => handleDeadlineChange(team.id, activity.id, subActivity.id, task.id)}
                                                                                            style={{ cursor: 'pointer', fontSize: '1.5em', margin: '15px' }}
                                                                                        >
                                                                                            &#128197;
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className='task-meta-input-container'>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="task-meta-input"
                                                                                            value={task.link}
                                                                                            onChange={(e) => handleLinkChange(e.target.value, team.id, activity.id, subActivity.id, task.id)}
                                                                                            disabled={task.completed} // Disable input if task is completed
                                                                                        />
                                                                                        <span className="copy-icon" onClick={() => copyToClipboard(task.link)}>
                                                                                            Salin&#x1f4cb; {/* Copy icon */}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div>Status: {task.status}</div>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={task.completed}
                                                                                        onChange={() => toggleTaskCompletion(team.id, activity.id, subActivity.id, task.id)}
                                                                                    />
                                                                                </div>
                                                                                <div className="task-actions">
                                                                                    <span onClick={() => renameTask(team.id, activity.id, subActivity.id, task.id, task.name)}>&#9998;</span>
                                                                                    <span onClick={() => deleteTask(team.id, activity.id, subActivity.id, task.id)}>&#10006;</span>
                                                                                    <span onClick={() => archiveTask(team.id, activity.id, subActivity.id, task.id)}>&#128229;</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="add-task-box" onClick={() => addTask(team.id, activity.id, subActivity.id)}>
                                                                        + Tambah Tugas {activity.name} - {subActivity.name}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                                <div className="add-sub-activity-box" onClick={() => addSubActivity(team.id, activity.id)}>
                                                    + Tambah Sub-Kegiatan {activity.name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="add-activity-box" onClick={() => addActivity(team.id)}>
                                    + Tambah Kegiatan Tim {team.name}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div className="add-team-box" onClick={addTeam}>
                    + Tambah Tim Kerja
                </div>
            </div>
        </div>
    );
}
export default TeamHierarchy;

// function TeamHierarchy() {
//     const [teams, refetchTeams] = useState([]);
//     const [activeTeams, setActiveTeams] = useState([]);
//     const [activeActivities, setActiveActivities] = useState([]);
//     const [subActivityTasks, setSubActivityTasks] = useState({});

//     const refetchTeams = async () => {
//         try {
//             const response = await axios.get('/teams');
//             refetchTeams(response.data);
//         } catch (error) {
//             console.error('Error updating teams data:', error);
//         }
//     };

//     const toggleTeamActivities = (id) => {
//         setActiveTeams(prevState =>
//             prevState.includes(id) ? prevState.filter(teamId => teamId !== id) : [...prevState, id]
//         );
//     };

//     const toggleActivitySubActivities = (teamId, Id) => {
//         setActiveActivities(prevState => {
//             const newActiveActivities = new Set(prevState);
//             newActiveActivities.has(Id) ? newActiveActivities.delete(Id) : newActiveActivities.add(Id);
//             return Array.from(newActiveActivities);
//         });
//     };

//     const toggleSubActivityTasks = (teamId, activityId, subActivityId) => {
//         setSubActivityTasks(prevState => ({
//             ...prevState,
//             [teamId]: {
//                 ...(prevState[teamId] || {}),
//                 [activityId]: {
//                     ...(prevState[teamId]?.[activityId] || {}),
//                     [subActivityId]: prevState[teamId]?.[activityId]?.[subActivityId] ? null : true
//                 }
//             }
//         }));
//     };

//     const addTeam = async () => {
//         const newTeamName = prompt('Masukkan nama tim baru:');
//         if (newTeamName) {
//             try {
//                 await axios.post('/teams', { name: newTeamName });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error adding team:', error);
//             }
//         }
//     };

//     const renameTeam = async (id) => {
//         const newName = prompt('Masukkan nama baru:');
//         if (newName) {
//             try {
//                 await axios.put(`/teams/${id}`, { name: newName });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error renaming team:', error);
//             }
//         }
//     };

//     const deleteTeam = async (id) => {
//         try {
//             await axios.delete(`/teams/${id}`);
//             refetchTeams();
//         } catch (error) {
//             console.error('Error deleting team:', error);
//         }
//     };

//     const archiveTeam = async (id) => {
//         // Implement archiving logic if applicable
//         alert(`Tim Kerja ${teams.find(team => team.id === id).name} telah diarsipkan.`);
//     };

//     const addActivity = async (teamId) => {
//         const newActivity = prompt('Masukkan nama kegiatan baru:');
//         if (newActivity) {
//             try {
//                 await axios.post(`/teams/${teamId}/activities`, { name: newActivity });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error adding activity:', error);
//             }
//         }
//     };

//     const renameActivity = async (teamId, Id) => {
//         const newName = prompt('Masukkan nama kegiatan baru:');
//         if (newName) {
//             try {
//                 await axios.put(`/teams/${teamId}/activities/${Id}`, { name: newName });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error renaming activity:', error);
//             }
//         }
//     };

//     const deleteActivity = async (teamId, Id) => {
//         try {
//             await axios.delete(`/teams/${teamId}/activities/${Id}`);
//             refetchTeams();
//         } catch (error) {
//             console.error('Error deleting activity:', error);
//         }
//     };

//     const archiveActivity = async (teamId, Id) => {
//         // Implement archiving logic if applicable
//         alert(`Kegiatan ${teams.find(team => team.id === teamId).activities[Id].name} telah diarsipkan.`);
//     };

//     const addSubActivity = async (teamId, activityId) => {
//         const newSubActivity = prompt('Masukkan nama sub-kegiatan baru:');
//         if (newSubActivity) {
//             try {
//                 await axios.post(`/teams/${teamId}/activities/${activityId}/sub-activities`, { name: newSubActivity });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error adding sub-activity:', error);
//             }
//         }
//     };

//     const renameSubActivity = async (teamId, activityId, subActivityId) => {
//         const newName = prompt('Masukkan nama sub-kegiatan baru:');
//         if (newName) {
//             try {
//                 await axios.put(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}`, { name: newName });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error renaming sub-activity:', error);
//             }
//         }
//     };

//     const deleteSubActivity = async (teamId, activityId, subActivityId) => {
//         try {
//             await axios.delete(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}`);
//             refetchTeams();
//         } catch (error) {
//             console.error('Error deleting sub-activity:', error);
//         }
//     };

//     const archiveSubActivity = async (teamId, activityId, subActivityId) => {
//         // Implement archiving logic if applicable
//         alert(`Sub-Kegiatan ${teams.find(team => team.id === teamId).activities[activityId].subActivities[subActivityId].name} telah diarsipkan.`);
//     };

//     const addTask = async (teamId, activityId, subActivityId) => {
//         const newTaskName = prompt('Masukkan nama tugas baru:');
//         const dueDate = prompt('Masukkan deadline tugas (YYYY-MM-DD):');
//         const driveLink = prompt('Masukkan link drive (bukti dukung):');

//         if (newTaskName) {
//             const newTask = {
//                 name: newTaskName,
//                 dateCreated: new Date().toISOString().split('T')[0],
//                 dueDate: dueDate || 'Tidak ada',
//                 driveLink: driveLink || '#',
//                 completed: false
//             };
//             try {
//                 await axios.post(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks`, newTask);
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error adding task:', error);
//             }
//         }
//     };

//     const renameTask = async (teamId, activityId, subActivityId, taskId, currentName) => {
//         const newName = prompt('Masukkan nama tugas baru:', currentName);
//         if (newName) {
//             try {
//                 await axios.put(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}`, { name: newName });
//                 refetchTeams();
//             } catch (error) {
//                 console.error('Error renaming task:', error);
//             }
//         }
//     };

//     const deleteTask = async (teamId, activityId, subActivityId, taskId) => {
//         try {
//             await axios.delete(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}`);
//             refetchTeams();
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     };

//     const archiveTask = async (teamId, activityId, subActivityId, taskId) => {
//         // Implement archiving logic if applicable
//         alert(`Tugas ${teams.find(team => team.id === teamId).activities[activityId].subActivities[subActivityId].tasks[taskId].name} telah diarsipkan.`);
//     };

//     const toggleTaskCompletion = async (teamId, activityId, subActivityId, taskId) => {
//         try {
//             await axios.put(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/toggle`, {});
//             refetchTeams();
//         } catch (error) {
//             console.error('Error toggling task completion:', error);
//         }
//     };

//     const handleDeadlineChange = async (teamId, activityId, subActivityId, taskId, newDeadline) => {
//         try {
//             await axios.put(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/deadline`, { dueDate: newDeadline });
//             refetchTeams();
//         } catch (error) {
//             console.error('Error updating task deadline:', error);
//         }
//     };

//     const handleDriveLinkChange = async (teamId, activityId, subActivityId, taskId, newLink) => {
//         try {
//             await axios.put(`/teams/${teamId}/activities/${activityId}/sub-activities/${subActivityId}/tasks/${taskId}/link`, { driveLink: newLink });
//             refetchTeams();
//         } catch (error) {
//             console.error('Error updating task drive link:', error);
//         }
//     };

//     return (
//         <div className="team-hierarchy">
//             <h1>Team Hierarchy</h1>
//             <button onClick={addTeam}>Tambah Tim</button>
//             {teams.map(team => (
//                 <div key={team.id} className="team">
//                     <h2>
//                         <span onClick={() => toggleTeamActivities(team.id)}>{team.name}</span>
//                         <button onClick={() => renameTeam(team.id)}>Ubah Nama</button>
//                         <button onClick={() => deleteTeam(team.id)}>Hapus</button>
//                         <button onClick={() => archiveTeam(team.id)}>Arsipkan</button>
//                     </h2>
//                     {activeTeams.includes(team.id) && (
//                         <div className="activities">
//                             {team.activities.map((activity, Id) => (
//                                 <div key={Id} className="activity">
//                                     <h3>
//                                         <span onClick={() => toggleActivitySubActivities(team.id, Id)}>{activity.name}</span>
//                                         <button onClick={() => renameActivity(team.id, Id)}>Ubah Nama</button>
//                                         <button onClick={() => deleteActivity(team.id, Id)}>Hapus</button>
//                                         <button onClick={() => archiveActivity(team.id, Id)}>Arsipkan</button>
//                                     </h3>
//                                     {activeActivities.includes(Id) && (
//                                         <div className="sub-activities">
//                                             {activity.subActivities.map((subActivity, subId) => (
//                                                 <div key={subId} className="sub-activity">
//                                                     <h4>
//                                                         <span onClick={() => toggleSubActivityTasks(team.id, Id, subId)}>{subActivity.name}</span>
//                                                         <button onClick={() => renameSubActivity(team.id, Id, subId)}>Ubah Nama</button>
//                                                         <button onClick={() => deleteSubActivity(team.id, Id, subId)}>Hapus</button>
//                                                         <button onClick={() => archiveSubActivity(team.id, Id, subId)}>Arsipkan</button>
//                                                     </h4>
//                                                     {subActivityTasks[team.id]?.[Id]?.[subId] && (
//                                                         <div className="tasks">
//                                                             {subActivity.tasks.map((task, taskId) => (
//                                                                 <div key={taskId} className="task">
//                                                                     <p>{task.name}</p>
//                                                                     <p>Deadline: {task.dueDate}</p>
//                                                                     <p>Link: <a href={task.driveLink} target="_blank" rel="noopener noreferrer">{task.driveLink}</a></p>
//                                                                     <button onClick={() => renameTask(team.id, Id, subId, taskId, task.name)}>Ubah Nama</button>
//                                                                     <button onClick={() => deleteTask(team.id, Id, subId, taskId)}>Hapus</button>
//                                                                     <button onClick={() => toggleTaskCompletion(team.id, Id, subId, taskId)}>
//                                                                         {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
//                                                                     </button>
//                                                                     <button onClick={() => handleDeadlineChange(team.id, Id, subId, taskId, prompt('Masukkan deadline baru:', task.dueDate))}>Ubah Deadline</button>
//                                                                     <button onClick={() => handleDriveLinkChange(team.id, Id, subId, taskId, prompt('Masukkan link drive baru:', task.driveLink))}>Ubah Link</button>
//                                                                 </div>
//                                                             ))}
//                                                             <button onClick={() => addTask(team.id, Id, subId)}>Tambah Tugas</button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ))}
//                                             <button onClick={() => addSubActivity(team.id, Id)}>Tambah Sub-Kegiatan</button>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                             <button onClick={() => addActivity(team.id)}>Tambah Kegiatan</button>
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default TeamHierarchy;
