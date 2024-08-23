import axios from "axios";

//Konfigurasi Axios

export const baseURL = "http://localhost:5000/api";

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
});
