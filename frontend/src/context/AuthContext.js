import { node } from "prop-types";
import { createContext, useState, useEffect } from "react";

/**
 * File untuk membuat state global
 * 
 * @property auth: Object => state yang berisi:
 *  - uid: id user yang login
 *  - role: role user yang login
 *  - token: access token api
 * 
 * Token disimpan di localstorage, sementara lainnya di session storage
 */

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
    return <div>Loading...</div>; // or any loading spinner/component
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: node,
};

export default AuthContext;
