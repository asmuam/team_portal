import React, { useState } from "react";
import useAuth from "./hooks/use-auth.js";
import { BrowserRouter as Router } from "react-router-dom";
import { useTeams } from "./context/TeamsContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AppRouter from "./components/common/AppRoutes";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function App() {
  const { teams, setTeams } = useTeams();
  const [allData, setAllData] = useState([]);
  const { auth, setAuth } = useAuth();
  const isAuthenticated = !!auth.token;

  const handleLogin = (result) => {
    localStorage.setItem("authToken", result.accessToken);
    sessionStorage.setItem("uid", result.uid);
    sessionStorage.setItem("role", result.role);
    sessionStorage.setItem("username", result.username); // Simpan username ke sessionStorage
    sessionStorage.setItem("name", result.name); // Simpan username ke sessionStorage
    setAuth({
      uid: result.uid,
      role: result.role,
      token: result.accessToken,
      username: result.username, // Set username ke state auth
      name: result.name, // Set username ke state auth
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
      sessionStorage.removeItem("username"); // Hapus username dari sessionStorage
      sessionStorage.removeItem("name"); // Hapus username dari sessionStorage
      setAuth({});
    }
  };

  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          username={auth.username} // Kirim username ke Header sebagai prop
          name={auth.name} // Kirim nama ke Header sebagai prop
          role={auth.role} // Kirim role ke Header sebagai prop
        />
        <Box component="main" sx={{ flex: 1, py: 4 }}>
          <Container maxWidth="xl">
            <AppRouter isAuthenticated={isAuthenticated} teams={teams} setTeams={setTeams} handleLogin={handleLogin} />
          </Container>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
