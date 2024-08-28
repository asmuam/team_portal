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

function App() {
  const [teams, setTeams] = useState([]);
  const [allData, setAllData] = useState([]);
  const { auth, setAuth } = useAuth();
  const isAuthenticated = !!auth.token;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched teams:", data);
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allData`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched teams:", data);
        setAllData(data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchAllData();
  }, []);

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
    }
  };

  return (
    <Router>
      <div className="App">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <header className="App-header">
              <h1>INOVEAZY</h1>
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
              <button className="logout-button" onClick={handleLogout}>
                <i className="fas fa-power-off"></i> Log Out
              </button>
            </header>
            <main className="App-main">
              <Routes>
                <Route path="/" element={<Navigate to="/explorer" />} />
                <Route path="/explorer" element={<TeamHierarchy teams={teams} setTeams={setTeams} />} />
                <Route path="/table" element={<DataTable data={allData} />} />
                <Route path="/links" element={<LinkPenting />} />
                <Route path="/explorer/kegiatan/:teamId" element={<Kegiatan />} />
                <Route path="/explorer/kegiatan/:teamId/subkegiatan/:activityId" element={<SubKegiatan />} />
                <Route path="/explorer/kegiatan/:teamId/subkegiatan/:activityId/tugas/:subActivityId" element={<Tugas />} />
              </Routes>
            </main>
            <footer className="App-footer">
              <p>&copy; 2024 Your Company</p>
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
