import api from "@/services/api";


export const sendRequestApi = (data) => api.post("/friends/send-request", data);
export const acceptRequestApi = (data) =>
  api.post("/friends/accept-request", data);
export const rejectRequestApi = (data) =>
  api.post("/friends/reject-request", data);
export const cancelRequestApi = (data) =>
  api.delete("/friends/cancel-request", { data });

export const getIncomingRequestsApi = () =>
  api.get("/friends/incoming-requests");
export const getSentRequestsApi = () => api.get("/friends/sent-requests");
export const getFriendsApi = (userId) => api.get(`/friends/${userId}`);

export const getMutualFriendsApi = (userId) =>
  api.get(`/friends/${userId}/mutual-friends`);
