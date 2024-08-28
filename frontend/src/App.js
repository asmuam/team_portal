import "./App.css";
import TeamHierarchy from "./components/TeamHierarchy.js";
import DataTable from "./components/DataTable.js";
import React, { useState, useEffect } from "react";
import LinkPenting from "./components/LinkPenting.js";
import Login from "./components/Login.js";
import useAuth from "./hooks/use-auth.js";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Kegiatan from "./components/Kegiatan";
import SubKegiatan from "./components/SubKegiatan";
import Tugas from "./components/Tugas";
import { useTeams } from './context/TeamsContext'; // Adjust path as needed

function App() {
  const { teams, setTeams } = useTeams();
  const [allData, setAllData] = useState([]);
  const { auth, setAuth } = useAuth();
  const isAuthenticated = !!auth.token;

  const handleLogin = (result) => {
    localStorage.setItem("authToken", result.accessToken);
    sessionStorage.setItem("uid", result.uid);
    sessionStorage.setItem("role", result.role);
    setAuth({
      uid: result.uid,
      role: result.role,
      token: result.accessToken,
    });
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("uid");
      sessionStorage.removeItem("role");
      setAuth({});
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>INOVEAZY</h1>
          {isAuthenticated && (
            <div className="tabs">
              <Link to="/explorer">
                <button>Explorer</button>
              </Link>
              <Link to="/table">
                <button>Tabel</button>
              </Link>
              <Link to="/links">
                <button>Link Penting</button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-power-off"></i> Log Out
            </button>
          )}
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? "/explorer" : "/login"} />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/explorer" />} />
            <Route path="/explorer" element={isAuthenticated ? <TeamHierarchy teams={teams} setTeams={setTeams} /> : <Navigate to="/login" />} />
            <Route path="/table" element={isAuthenticated ? <DataTable /> : <Navigate to="/login" />} />
            <Route path="/links" element={isAuthenticated ? <LinkPenting /> : <Navigate to="/login" />} />
            <Route path="/explorer/kegiatan/:teamId" element={isAuthenticated ? <Kegiatan /> : <Navigate to="/login" />} />
            <Route path="/explorer/kegiatan/:teamId/subkegiatan/:activityId" element={isAuthenticated ? <SubKegiatan /> : <Navigate to="/login" />} />
            <Route path="/explorer/kegiatan/:teamId/subkegiatan/:activityId/tugas/:subActivityId" element={isAuthenticated ? <Tugas /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>&copy; 2024 Your Company</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;