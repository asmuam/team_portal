import React, { useState } from 'react';
import './ModalForm.css'; // Pastikan file CSS ini ada

const TambahSubActivity = ({ isOpen, onClose, onSubmit }) => {
    const [newSubActivityName, setNewSubActivityName] = useState(''); // Gunakan state yang benar

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newSubActivityName) { // Gunakan state yang benar di sini
            onSubmit({ name: newSubActivityName });
            onClose(); // Tutup modal setelah pengiriman
        }
    };

    if (!isOpen) {
        return null; // Jangan render modal jika tidak dibuka
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Tambah Sub-Kegiatan</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="subactivity-name">Nama Sub-Kegiatan Baru:</label>
                        <input
                            type="text"
                            id="subactivity-name"
                            value={newSubActivityName} // Gunakan state yang benar di sini
                            onChange={(e) => setNewSubActivityName(e.target.value)} // Gunakan setter yang benar di sini
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Tambah Sub-Kegiatan</button>
                        <button type="button" onClick={onClose}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahSubActivity;
