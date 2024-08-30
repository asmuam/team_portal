import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Login";
import TeamHierarchy from "../TeamHierarchy";
import DataTable from "../DataTable";
import LinkPenting from "../LinkPenting";
import Kegiatan from "../Kegiatan";
import SubKegiatan from "../SubKegiatan";
import Tugas from "../Tugas";


function AppRouter({ isAuthenticated, teams, setTeams, handleLogin }) {
    return (
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/explorer" : "/login"} />} />
                <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/explorer" />} />
                <Route path="/explorer" element={isAuthenticated ? <TeamHierarchy teams={teams} setTeams={setTeams} /> : <Navigate to="/login" />} />
                <Route path="/table" element={isAuthenticated ? <DataTable /> : <Navigate to="/login" />} />
                <Route path="/links" element={isAuthenticated ? <LinkPenting /> : <Navigate to="/login" />} />
                <Route path="/explorer/team/:teamId/kegiatan" element={isAuthenticated ? <Kegiatan /> : <Navigate to="/login" />} />
                <Route path="/explorer/team/:teamId/kegiatan/:activityId/subkegiatan" element={isAuthenticated ? <SubKegiatan /> : <Navigate to="/login" />} />
                <Route path="/explorer/team/:teamId/kegiatan/:activityId/subkegiatan/:subActivityId/tugas" element={isAuthenticated ? <Tugas /> : <Navigate to="/login" />} />
            </Routes>
    );
}

export default AppRouter;
