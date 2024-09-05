import React, { useState, useEffect } from "react";
import useAuth from "./hooks/use-auth.js";
import { useNavigate } from "react-router-dom";
import { useTeams } from "./context/TeamsContext";
import Header from "./components/common/navigation/Header";
import Footer from "./components/common/navigation/Footer";
import AppRouter from "./components/common/navigation/AppRoutes";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { api } from "./utils/axios.js";
import LogoutModal from "./components/LogOutModal.js"; // Import the LogoutModal

function App() {
  const { teams, setTeams } = useTeams();
  const [allData, setAllData] = useState([]);
  const { auth, setAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openLogoutModal, setOpenLogoutModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        console.error("validating...", token);
        try {
          const response = await api.post(
            `/validateToken`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const { user } = response.data;
            setAuth({ ...user, token });
            setIsAuthenticated(true);
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error("Token validation error", error);
          clearAuth();
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    };

    validateAuth();
  }, [setAuth]);

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    setAuth({});
    setIsAuthenticated(false);
    setOpenLogoutModal(false);

    navigate("/login");
  };

  const handleLogin = (result) => {
    localStorage.setItem("authToken", result.accessToken);
    sessionStorage.setItem("uid", result.uid);
    sessionStorage.setItem("role", result.role);
    sessionStorage.setItem("username", result.username);
    sessionStorage.setItem("name", result.name);
    setAuth({
      uid: result.uid,
      role: result.role,
      token: result.accessToken,
      username: result.username,
      name: result.name,
    });
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = async () => {
    try {
      await api.post(
        `logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Hapus auth token dan session
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("uid");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("name");

      // Set auth state ke default
      setAuth({});
      setIsAuthenticated(false);
      setOpenLogoutModal(false); // Tutup modal

      // Refresh halaman sebelum pindah ke login
      navigate("/login"); // Pindah ke halaman login setelah refresh
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header
        isAuthenticated={isAuthenticated}
        handleLogout={() => setOpenLogoutModal(true)} // Trigger the modal
        username={auth.username}
        name={auth.name}
        role={auth.role}
      />
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          <AppRouter role={auth.role} isAuthenticated={isAuthenticated} teams={teams} setTeams={setTeams} handleLogin={handleLogin} />
        </Container>
      </Box>
      <Footer />
      <LogoutModal open={openLogoutModal} handleClose={() => setOpenLogoutModal(false)} handleLogout={handleLogout} />
    </Box>
  );
}

export default App;
