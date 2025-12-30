import api from "../../services/api";

export const createPostApi = (data) => api.post("/post", data);
export const getAllPostsApi = () => api.get("/post");
export const getMyPostsApi = () => api.get("/post/me");
export const getPostByIdApi = (id) => api.get(`/post/${id}`);
export const getUserPostsApi = (id) => api.get(`/post/user/${id}`);
export const deletePostApi = (id) => api.delete(`/post/${id}`);
export const likePostApi = (id) => api.put(`/post/${id}/like`);
export const unlikePostApi = (id) => api.put(`/post/${id}/unlike`);
export const addCommentApi = (id, data) =>
  api.post(`/post/${id}/comments`, data);
export const getCommentsApi = (id) => api.get(`/post/${id}/comments`);
export const deleteCommentApi = (id) => api.delete(`/post/comments/${id}`);
