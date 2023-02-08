import axios from "axios";

// Create base URL API
export const API = axios.create({
  // baseURL: "https://3408-2404-8000-1004-b94f-71a6-be6-bec4-1ca1.ap.ngrok.io/api/v1/",
  // baseURL: process.env.REACT_APP_API,
  baseURL: "http://localhost:5000/api/v1/",
});
// Set Authorization Token Header
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
