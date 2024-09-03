import axios from "axios";

//Konfigurasi Axios

export const baseURL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const apiPrivate = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: 'include'
});
