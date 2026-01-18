import api from "@/services/api";

export const createPostApi = (data) => api.post("/posts", data);
export const getAllPostsApi = () => api.get("/posts");
export const getMyPostsApi = () => api.get("/posts/me");
export const getPostByIdApi = (id) => api.get(`/posts/${id}`);
export const getUserPostsApi = (id) => api.get(`/posts/user/${id}`);
export const deletePostApi = (id) => api.delete(`/posts/${id}`);

export const getGroupPostsApi = (groupId) =>
  api.get(`/posts/group/${groupId}`);


export const toggleLikePostApi = (id) => api.put(`/posts/${id}/like`);
export const toggleSavePostApi = (id) => api.put(`/posts/${id}/save`);


export const addCommentApi = (id, data) =>
  api.post(`/posts/${id}/comments`, data);

export const getCommentsApi = (id) =>
  api.get(`/posts/${id}/comments`);

export const deleteCommentApi = (id) =>
  api.delete(`/posts/comments/${id}`);
