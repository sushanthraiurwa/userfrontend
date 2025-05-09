import axios from "axios";

const api = axios.create({
  baseURL: "https://bmsce-utsav-event-leaderboard-backend.onrender.com/api"
});

export default api;

// New API functions
export const startTimer = () => api.post("/teams/start-timer");
export const stopTimer = (id) => api.post(`/teams/${id}/stop-timer`);
export const getSortedTeams = () => api.get("/teams/sorted");
