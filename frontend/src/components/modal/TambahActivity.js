import React, { useState } from 'react';
import './ModalForm.css'; // Pastikan file CSS ini ada

const TambahActivity = ({ isOpen, onClose, onSubmit }) => {
    const [newActivityName, setNewActivityName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newActivityName) {
            onSubmit({ name: newActivityName });
            onClose(); // Tutup modal setelah pengiriman
        }
    };

    if (!isOpen) {
        return null; // Jangan render modal jika tidak dibuka
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Tambah Kegiatan</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="activity-name">Nama Kegiatan Baru:</label>
                        <input
                            type="text"
                            id="activity-name"
                            value={newActivityName}
                            onChange={(e) => setNewActivityName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Tambah Kegiatan</button>
                        <button type="button" onClick={onClose}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahActivity;
