import { useEffect } from "react";
import useAuth from "./use-auth";
import useRefreshToken from "./use-refresh-token";
import { apiPrivate, api } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "../components/alert";

/**
 * Konfigurasi axios untuk endpoint yang memerlukan access token
 * 
 * @returns apiPrivate dengan authorization header
 */
const useAxiosPrivate = () => {
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    // Konfigurasi request interceptor
    const requestIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        if (auth?.token) {
          config.headers["Authorization"] = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Konfigurasi response interceptor
    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            // Refresh token dan mendapatkan token baru
            const newAccessToken = await refresh();
            if (newAccessToken) {
              // Update header Authorization dengan token baru
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              // Coba ulang permintaan dengan token baru
              return apiPrivate(prevRequest);
            }
          } catch (err) {
            // Tangani jika refresh token juga gagal atau tidak ada
            await api.post("/logout");
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("uid");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("name");
            setAuth({});
            toast.fire({
              icon: "info",
              text: "Session telah berakhir",
            });
            navigate("/");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, navigate, setAuth]);

  return apiPrivate;
};

export default useAxiosPrivate;
