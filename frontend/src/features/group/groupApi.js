import api from "@/services/api";

export const createGroupApi = (formData) => api.post("/groups", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const getMyGroupsApi = () => api.get("/groups/my");

export const getAllGroupsApi = () => api.get("/groups/all");

export const getGroupByIdApi = (groupId) => api.get(`/groups/${groupId}`);

export const joinGroupApi = (groupId) => api.post(`/groups/${groupId}/join`);

export const cancelJoinRequestApi = (groupId) => api.post(`/groups/${groupId}/cancel-request`);

export const approveGroupMemberApi = (data) => api.post(`/groups/approve`, data);

export const removeMemberApi = (data) => api.post(`/groups/remove-member`, data);

export const updateGroupCoverApi = (groupId, formData) =>
  api.patch(`/groups/${groupId}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateGroupAvatarApi = (groupId, formData) =>
  api.patch(`/groups/${groupId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });