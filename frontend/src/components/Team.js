import Activity from "./Activity";

function Team({ team, renameTeam, deleteTeam, archiveTeam, addActivity, renameActivity, deleteActivity, archiveActivity }) {
    const handleRenameTeam = () => {
        const newName = prompt('Masukkan nama baru:');
        if (newName) {
            renameTeam(team.id, newName);
        }
    };

    return (
        <div className="team-box">
            <div className="team-name">{team.name}</div>
            <div className="team-actions">
                <span onClick={handleRenameTeam}>&#9998;</span>
                <span onClick={() => deleteTeam(team.id)}>&#10006;</span>
                <span onClick={() => archiveTeam(team.id)}>&#128229;</span>
            </div>
            <div className="activities">
                {team.activities.map((activity, index) => (
                    <Activity
                        key={index}
                        teamId={team.id}
                        index={index}
                        activity={activity}
                        renameActivity={renameActivity}
                        deleteActivity={deleteActivity}
                        archiveActivity={archiveActivity}
                    />
                ))}
                <div className="add-activity-box" onClick={() => addActivity(team.id)}>
                    + Tambah Kegiatan
                </div>
            </div>
        </div>
    );
}

export default Team;