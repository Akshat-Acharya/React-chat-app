import axios from "axios";
import { HOST } from "@/utils/constants";

console.log("API Base URL:", HOST); // Debugging

export const apiClient = axios.create({
  baseURL: HOST || "http://localhost:8747", // Fallback if ENV is missing
});
