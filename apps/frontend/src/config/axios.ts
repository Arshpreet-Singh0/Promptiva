import axios from "axios";
import { BACKEND_URL } from "./constants";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});