import axios from "axios";
import { baseURL } from "./baseUrl";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 100000,
});
