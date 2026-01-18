import api from "@/services/api";

export const sendMessageApi = ({userId, message}) =>
  api.post(`/messages/${userId}`, {message});

export const getMessagesApi = (id) =>
  api.get(`/messages/${id}`);


export const deleteChatApi = (userId) => {
  return api.delete(`/messages/chat/${userId}`);
};

export const getAllConversationsApi = () => {
  return api.get(`/messages/conversations`);
};

export const sendGroupMessageApi = (groupId, message) =>
  api.post(`/messages/group/${groupId}`, { message });

export const getGroupMessagesApi = (groupId) =>
  api.get(`/messages/group/${groupId}`);
