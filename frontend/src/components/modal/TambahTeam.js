// TambahTeam.js
import React, { useState } from 'react';
import './ModalForm.css'; // Pastikan file CSS ini ada

const TambahTeam = ({ isOpen, onClose, onSubmit }) => {
    const [newTeamName, setNewTeamName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTeamName) {
            onSubmit({ name: newTeamName });
            onClose(); // Close the modal after submission
        }
    };

    if (!isOpen) {
        return null; // Don't render the modal if it's not open
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Tambah Tim Kerja</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Tim Baru:</label>
                        <input
                            type="text"
                            id="name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Tambah Tim</button>
                        <button type="button" onClick={onClose}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahTeam;
