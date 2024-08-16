import React from 'react';

function Activity({ teamId, index, activity, renameActivity, deleteActivity, archiveActivity }) {
    const handleRenameActivity = () => {
        const newName = prompt('Masukkan nama baru untuk kegiatan:');
        if (newName) {
            renameActivity(teamId, index, newName);
        }
    };

    return (
        <div className="activity-box">
            <div className="activity-name">{activity}</div>
            <div className="activity-actions">
                <span onClick={handleRenameActivity}>&#9998;</span>
                <span onClick={() => deleteActivity(teamId, index)}>&#10006;</span>
                <span onClick={() => archiveActivity(teamId, index)}>&#128229;</span>
            </div>
        </div>
    );
}

export default Activity;
