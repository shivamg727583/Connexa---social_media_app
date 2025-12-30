import api from "../../services/api";

export const registerApi = (data) => api.post("/user/register", data);
export const loginApi = (data) => api.post("/user/login", data);
export const getProfileApi = () => api.get("/user/profile");
export const getProfileByIdApi = (id) => api.get(`/user/${id}/profile`);
export const editProfileApi = (data) => api.post("/user/profile/edit", data);
export const suggestedUsersApi = () => api.get("/user/suggested");

