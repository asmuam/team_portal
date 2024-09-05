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
import ProtectedRoute from '../../ProtectedRoute'; // Import the ProtectedRoute component

function AppRouter({ role, isAuthenticated, teams, setTeams, handleLogin }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/explorer" : "/login"} />} />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/explorer" />}
      />
      <Route
        path="/explorer"
        element={<ProtectedRoute element={<TeamHierarchy teams={teams} setTeams={setTeams} />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/table"
        element={<ProtectedRoute element={<DataTable />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/links"
        element={<ProtectedRoute element={<LinkPenting />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/explorer/team/:teamId/kegiatan"
        element={<ProtectedRoute element={<Kegiatan />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/explorer/team/:teamId/kegiatan/:activityId/subkegiatan"
        element={<ProtectedRoute element={<SubKegiatan />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/explorer/team/:teamId/kegiatan/:activityId/subkegiatan/:subActivityId/tugas"
        element={<ProtectedRoute element={<Tugas />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin', 'pegawai']} />}
      />
      <Route
        path="/user-management"
        element={<ProtectedRoute element={<UserManagement />} isAuthenticated={isAuthenticated} role={role} allowedRoles={['admin']} />}
      />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
