import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hooks memanggil state global
 * @returns [auth, setAuth] = useState[{}]
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
