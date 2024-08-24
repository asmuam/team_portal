import './App.css';

import TeamHierarchy from './components/TeamHierarchy.js';
import DataTable from './components/DataTable.js';
import React, { useState, useEffect } from 'react';
import LinkPenting from './components/LinkPenting.js';
import Login from './components/Login.js';
import RequiredNonAuth from "./components/auth/auth-path.js";
import RequiredAuth from "./components/auth/required-path.js";

function App() {

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched teams:', data);
                setTeams(data);
            } catch (error) {
                console.error('Failed to fetch teams:', error);
            }
        };

        fetchTeams();
    }, []);


    const [activeTab, setActiveTab] = useState('teamHierarchy'); // Default tab

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            // Optionally call the backend to handle server-side logout
            await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
        }
    };


    return (
        <div className='App'>
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <header className='App-header'>
                        <h1>INOVEAZY</h1>
                        <button className="logout-button" onClick={handleLogout}>
                            <i className="fas fa-power-off"> Log Out</i> {/* Font Awesome icon */}
                        </button>
                    </header>
                    <main className='App-main'>
                        {/* Tab Navigation */}
                        <div className="tabs">
                            <button
                                className={activeTab === 'teamHierarchy' ? 'active' : ''}
                                onClick={() => setActiveTab('teamHierarchy')}
                            >
                                Explorer
                            </button>
                            <button
                                className={activeTab === 'dataTable' ? 'active' : ''}
                                onClick={() => setActiveTab('dataTable')}
                            >
                                Tabel
                            </button>
                            <button
                                className={activeTab === 'linkPenting' ? 'active' : ''}
                                onClick={() => setActiveTab('linkPenting')}
                            >
                                Link Penting
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {activeTab === 'teamHierarchy' && (
                                <div className='main-page'>
                                    <div className="page active">
                                        <TeamHierarchy teams={teams} setTeams={setTeams} />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'dataTable' && (
                                <div className="page active">
                                    <DataTable data={teams} />
                                </div>
                            )}
                            {activeTab === 'linkPenting' && (
                                <div className="page active">
                                    <LinkPenting data={teams} />
                                </div>
                            )}
                        </div>
                    </main>
                    <footer className='App-footer'>
                        <p>&copy; 2024 Your Company</p>
                    </footer>
                </>
            )}
        </div>
    );
}


export default App;
