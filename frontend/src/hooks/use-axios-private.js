import { useEffect } from "react";
import useAuth from "./use-auth";
import useRefreshToken from "./use-refresh-token";
import { api, apiPrivate } from "../utils/axios";
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
    // konfigurasi request header
    const requestIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // konfigurasi response error
    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          await api.post("logout", {
            id: auth.user,
          });
          setAuth({ user: "", role: "" });
          sessionStorage.clear();
          localStorage.clear();
          toast.fire({
            icon: "info",
            text: "Session telah berakhir",
          });
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return apiPrivate;
};

export default useAxiosPrivate;
