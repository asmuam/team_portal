import { api } from "../utils/axios";
import useAuth from "./use-auth";

/**
 * Mendapatkan access token dari refresh token dan disimpan 
   di global state dan local storage
 *
 * @returns refresh: Function
 */

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await api.post("refresh", {
      id: auth.user,
    });
    localStorage.setItem("_mulyo_farm_sess_id_", response.data);
    setAuth((prev) => {
      return { ...prev, token: response.data };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
