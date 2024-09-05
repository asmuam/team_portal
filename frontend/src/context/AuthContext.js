import { node } from "prop-types";
import { createContext, useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    uid: sessionStorage.getItem("uid"),
    role: sessionStorage.getItem("role"),
    name: sessionStorage.getItem("name"),
    username: sessionStorage.getItem("username"),
    token: localStorage.getItem("authToken"),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");
    const username = sessionStorage.getItem("username");
    const token = localStorage.getItem("authToken");

    setAuth({ uid, role, token, name, username });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: node,
};

export default AuthContext;
