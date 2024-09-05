import { api } from "../utils/axios";
import useAuth from "./use-auth";

/**
 * Mendapatkan access token dari refresh token dan disimpan 
 * di global state dan local storage
 *
 * @returns refresh: Function
 */
const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      // Ambil uid dari sessionStorage
      const uid = sessionStorage.getItem("uid");
      
      if (!uid) {
        throw new Error("UID tidak ditemukan di sessionStorage");
      }

      const response = await api.post("/refresh", { uid });
      const { accessToken } = response.data;

      // Menyimpan access token baru di local storage dan global state
      localStorage.setItem("authToken", accessToken);
      setAuth((prev) => ({ ...prev, token: accessToken }));

      return accessToken; // Mengembalikan access token baru
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
