import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../../pages/Login";
import TeamHierarchy from "../../../pages/TeamHierarchy";
import DataTable from "../../../pages/DataTable";
import LinkPenting from "../../../pages/LinkPenting";
import Kegiatan from "../../../pages/Kegiatan";
import SubKegiatan from "../../../pages/SubKegiatan";
import Tugas from "../../../pages/Tugas";
import UserManagement from "../../../pages/UserManagement";
import ForbiddenPage from "../../../pages/error/403";
import ServerErrorPage from "../../../pages/error/500";
import NotFoundPage from "../../../pages/error/404";

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
      <Route path="/user-management" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} /> {/* Tambahkan route User Management */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
