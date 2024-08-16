import './App.css';

import React from 'react';
import TeamHierarchy from './components/TeamHierarchy.js';

function App() {
    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Team Hierarchy Management</h1>
            </header>
            <main className='App-main'>
                <TeamHierarchy />
            </main>
            <footer className='App-footer'>
                <p>&copy; 2024 Your Company</p>
            </footer>
        </div>
    );
}

export default App;
