import React, { useState } from 'react';
import './TeamHierarchy.css';

function TeamHierarchy() {
    const [teams, setTeams] = useState([
        //  
    ]);


    const [activeTeams, setActiveTeams] = useState([]);
    const [activeActivities, setActiveActivities] = useState([]);
    const [subActivityTasks, setSubActivityTasks] = useState({});

    const toggleTeamActivities = (id) => {
        setActiveTeams(prevState =>
            prevState.includes(id) ? prevState.filter(teamId => teamId !== id) : [...prevState, id]
        );
    };

    const toggleActivitySubActivities = (teamId, index) => {
        setActiveActivities(prevState => {
            // Create a new set of active activities
            const newActiveActivities = new Set(prevState);

            if (newActiveActivities.has(index)) {
                // If the activity is already active, remove it
                newActiveActivities.delete(index);
            } else {
                // Otherwise, add it to the set
                newActiveActivities.add(index);
            }

            return Array.from(newActiveActivities);
        });
    };


    const toggleSubActivityTasks = (teamId, activityIndex, subActivityIndex) => {
        setSubActivityTasks(prevState => ({
            ...prevState,
            [teamId]: {
                ...(prevState[teamId] || {}),
                [activityIndex]: {
                    ...(prevState[teamId]?.[activityIndex] || {}),
                    [subActivityIndex]: prevState[teamId]?.[activityIndex]?.[subActivityIndex] ? null : true
                }
            }
        }));
    };

    const addTeam = () => {
        const newTeamName = prompt('Masukkan nama tim baru:');
        if (newTeamName) {
            setTeams([...teams, { id: teams.length + 1, name: newTeamName, activities: [] }]);
        }
    };

    const renameTeam = (id) => {
        const newName = prompt('Masukkan nama baru:');
        if (newName) {
            setTeams(teams.map(team => team.id === id ? { ...team, name: newName } : team));
        }
    };

    const deleteTeam = (id) => {
        setTeams(teams.filter(team => team.id !== id));
    };

    const archiveTeam = (id) => {
        alert(`Tim Kerja ${teams.find(team => team.id === id).name} telah diarsipkan.`);
    };

    const addActivity = (teamId) => {
        const newActivity = prompt('Masukkan nama kegiatan baru:');
        if (newActivity) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? { ...team, activities: [...team.activities, { name: newActivity, subActivities: [] }] }
                    : team
            ));
        }
    };

    const renameActivity = (teamId, index) => {
        const newName = prompt('Masukkan nama kegiatan baru:');
        if (newName) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === index ? { ...activity, name: newName } : activity),
                    }
                    : team
            ));
        }
    };

    const deleteActivity = (teamId, index) => {
        setTeams(teams.map(team =>
            team.id === teamId
                ? {
                    ...team,
                    activities: team.activities.filter((_, i) => i !== index),
                }
                : team
        ));
    };

    const archiveActivity = (teamId, index) => {
        alert(`Kegiatan ${teams.find(team => team.id === teamId).activities[index].name} telah diarsipkan.`);
    };

    const addSubActivity = (teamId, activityIndex) => {
        const newSubActivity = prompt('Masukkan nama sub-kegiatan baru:');
        if (newSubActivity) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === activityIndex
                            ? { ...activity, subActivities: [...activity.subActivities, { name: newSubActivity, tasks: [] }] }
                            : activity
                        )
                    }
                    : team
            ));
        }
    };

    const renameSubActivity = (teamId, activityIndex, subActivityIndex) => {
        const newName = prompt('Masukkan nama sub-kegiatan baru:');
        if (newName) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === activityIndex
                            ? {
                                ...activity,
                                subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex ? { ...subActivity, name: newName } : subActivity)
                            }
                            : activity
                        )
                    }
                    : team
            ));
        }
    };

    const deleteSubActivity = (teamId, activityIndex, subActivityIndex) => {
        setTeams(teams.map(team =>
            team.id === teamId
                ? {
                    ...team,
                    activities: team.activities.map((activity, i) => i === activityIndex
                        ? {
                            ...activity,
                            subActivities: activity.subActivities.filter((_, j) => j !== subActivityIndex)
                        }
                        : activity
                    )
                }
                : team
        ));
    };

    const archiveSubActivity = (teamId, activityIndex, subActivityIndex) => {
        alert(`Sub-Kegiatan ${teams.find(team => team.id === teamId).activities[activityIndex].subActivities[subActivityIndex].name} telah diarsipkan.`);
    };

    const addTask = (teamId, activityIndex, subActivityIndex) => {
        const newTaskName = prompt('Masukkan nama tugas baru:');
        const dueDate = prompt('Masukkan deadline tugas (YYYY-MM-DD):');
        const driveLink = prompt('Masukkan link drive (bukti dukung):');

        if (newTaskName) {
            const newTask = {
                name: newTaskName,
                dateCreated: new Date().toISOString().split('T')[0],
                dueDate: dueDate || 'Tidak ada',
                driveLink: driveLink || '#',
                completed: false
            };
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === activityIndex
                            ? {
                                ...activity,
                                subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                    ? { ...subActivity, tasks: [...subActivity.tasks, newTask] }
                                    : subActivity
                                )
                            }
                            : activity
                        )
                    }
                    : team
            ));
        }
    };

    const renameTask = (teamId, activityIndex, subActivityIndex, taskIndex, currentName) => {
        const newName = prompt('Masukkan nama tugas baru:', currentName);
        if (newName) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === activityIndex
                            ? {
                                ...activity,
                                subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                    ? {
                                        ...subActivity,
                                        tasks: subActivity.tasks.map((task, k) => k === taskIndex ? { ...task, name: newName } : task)
                                    }
                                    : subActivity
                                )
                            }
                            : activity
                        )
                    }
                    : team
            ));
        }
    };


    const deleteTask = (teamId, activityIndex, subActivityIndex, taskIndex) => {
        setTeams(teams.map(team =>
            team.id === teamId
                ? {
                    ...team,
                    activities: team.activities.map((activity, i) => i === activityIndex
                        ? {
                            ...activity,
                            subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                ? {
                                    ...subActivity,
                                    tasks: subActivity.tasks.filter((_, k) => k !== taskIndex)
                                }
                                : subActivity
                            )
                        }
                        : activity
                    )
                }
                : team
        ));
    };

    const archiveTask = (teamId, activityIndex, subActivityIndex, taskIndex) => {
        alert(`Tugas ${teams.find(team => team.id === teamId).activities[activityIndex].subActivities[subActivityIndex].tasks[taskIndex]} telah diarsipkan.`);
    };

    const toggleTaskCompletion = (teamId, activityIndex, subActivityIndex, taskIndex) => {
        setTeams(teams.map(team =>
            team.id === teamId
                ? {
                    ...team,
                    activities: team.activities.map((activity, i) => i === activityIndex
                        ? {
                            ...activity,
                            subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                ? {
                                    ...subActivity,
                                    tasks: subActivity.tasks.map((task, k) => k === taskIndex ? { ...task, completed: !task.completed } : task)
                                }
                                : subActivity
                            )
                        }
                        : activity
                    )
                }
                : team
        ));
    };

    const handleDeadlineChange = (teamId, activityIndex, subActivityIndex, taskIndex) => {
        const newDeadline = prompt('Masukkan deadline baru (YYYY-MM-DD):');

        if (newDeadline) {
            setTeams(teams.map(team =>
                team.id === teamId
                    ? {
                        ...team,
                        activities: team.activities.map((activity, i) => i === activityIndex
                            ? {
                                ...activity,
                                subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                    ? {
                                        ...subActivity,
                                        tasks: subActivity.tasks.map((task, k) => k === taskIndex ? { ...task, dueDate: newDeadline, status: calculateTaskStatus(newDeadline, task.dateUpload) } : task)
                                    }
                                    : subActivity
                                )
                            }
                            : activity
                        )
                    }
                    : team
            ));
        }
    };


    const handleLinkChange = (e, teamId, activityIndex, subActivityIndex, taskIndex) => {
        const newLink = e.target.value;
        const dateUpload = new Date().toISOString().split('T')[0]; // Current date as upload date

        setTeams(teams.map(team =>
            team.id === teamId
                ? {
                    ...team,
                    activities: team.activities.map((activity, i) => i === activityIndex
                        ? {
                            ...activity,
                            subActivities: activity.subActivities.map((subActivity, j) => j === subActivityIndex
                                ? {
                                    ...subActivity,
                                    tasks: subActivity.tasks.map((task, k) => k === taskIndex ? { ...task, link: newLink, dateUpload, status: calculateTaskStatus(task.dueDate, dateUpload) } : task)
                                }
                                : subActivity
                            )
                        }
                        : activity
                    )
                }
                : team
        ));
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
                                {team.activities.map((activity, activityIndex) => (
                                    <div className='activity-container' key={activityIndex}>
                                        <div className="activity-box" onClick={() => toggleActivitySubActivities(team.id, activityIndex)}>
                                            <div className="activity-name">{activity.name}</div>
                                            <div className="activity-actions">
                                                <span onClick={() => renameActivity(team.id, activityIndex)}>&#9998;</span>
                                                <span onClick={() => deleteActivity(team.id, activityIndex)}>&#10006;</span>
                                                <span onClick={() => archiveActivity(team.id, activityIndex)}>&#128229;</span>
                                            </div>
                                        </div>
                                        {activeActivities.includes(activityIndex) && (
                                            <div className="sub-activities-content">
                                                {activity.subActivities.map((subActivity, subActivityIndex) => {
                                                    const progress = calculateProgress(subActivity.tasks);

                                                    return (
                                                        <div className='sub-activity-container' key={subActivityIndex}>
                                                            <div className="sub-activity-box" onClick={() => toggleSubActivityTasks(team.id, activityIndex, subActivityIndex)}>
                                                                <div className="sub-activity-name">
                                                                    {subActivity.name}
                                                                </div>
                                                                <div className="progress-status">
                                                                    {subActivity.tasks.length === 0 ? 'Belum ada tugas' : `Progress: ${progress.toFixed(2)}%`}
                                                                </div>
                                                                <div className="sub-activity-actions">
                                                                    <span onClick={() => renameSubActivity(team.id, activityIndex, subActivityIndex)}>&#9998;</span>
                                                                    <span onClick={() => deleteSubActivity(team.id, activityIndex, subActivityIndex)}>&#10006;</span>
                                                                    <span onClick={() => archiveSubActivity(team.id, activityIndex, subActivityIndex)}>&#128229;</span>
                                                                </div>
                                                            </div>
                                                            {subActivityTasks[team.id]?.[activityIndex]?.[subActivityIndex] && (
                                                                <div className="tasks-content">
                                                                    {subActivity.tasks.map((task, taskIndex) => (
                                                                        <div className='task-container' key={taskIndex}>
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
                                                                                            <span style={{color:'red'}}>{task.dueDate}</span>
                                                                                        </div>
                                                                                        <span
                                                                                            onClick={() => handleDeadlineChange(team.id, activityIndex, subActivityIndex, taskIndex)}
                                                                                            style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                                                                        >
                                                                                            &#128197;
                                                                                        </span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <input
                                                                                            type="text"
                                                                                            value={task.link}
                                                                                            onChange={(e) => handleLinkChange(e, team.id, activityIndex, subActivityIndex, taskIndex)}
                                                                                        />
                                                                                    </div>
                                                                                    <div>Status: {task.status}</div>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={task.completed}
                                                                                        onChange={() => toggleTaskCompletion(team.id, activityIndex, subActivityIndex, taskIndex)}
                                                                                    />
                                                                                </div>
                                                                                <div className="task-actions">
                                                                                    <span onClick={() => renameTask(team.id, activityIndex, subActivityIndex, taskIndex, task.name)}>&#9998;</span>
                                                                                    <span onClick={() => deleteTask(team.id, activityIndex, subActivityIndex, taskIndex)}>&#10006;</span>
                                                                                    <span onClick={() => archiveTask(team.id, activityIndex, subActivityIndex, taskIndex)}>&#128229;</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="add-task-box" onClick={() => addTask(team.id, activityIndex, subActivityIndex)}>
                                                                        + Tambah Tugas {activity.name} - {subActivity.name}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                                <div className="add-sub-activity-box" onClick={() => addSubActivity(team.id, activityIndex)}>
                                                    + Tambah Sub-Kegiatan {activity.name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="add-activity-box" onClick={() => addActivity(team.id)}>
                                    + Tambah Kegiatan {team.name}
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