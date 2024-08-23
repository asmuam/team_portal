import { node } from "prop-types";
import { createContext, useState } from "react";

/**
 * File untuk membuat state global
 * 
 * @property auth: Object => state yang berisi:
 *  - user: id user yang login
 *  - role: role user yang login
 *  - token: access token api
 * 
 * Token disimpan di localstorage, sementara lainnya di session storage
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    // user: sessionStorage.getItem("user"),
    // role: [sessionStorage.getItem("role")],
    token: localStorage.getItem("authToken"),
  });

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
