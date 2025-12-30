import api from "../../services/api";

export const sendMessageApi = ({userId, message}) =>
  api.post(`/messages/${userId}`, {message});

export const getMessagesApi = (id) =>
  api.get(`/messages/${id}`);

export const markAsReadApi = (conversationId) =>
  api.patch(`/messages/${conversationId}/markAsRead`);


export const deleteChatApi = (userId) => {
  return api.delete(`/messages/chat/${userId}`);
};

export const getAllConversationsApi = () => {
  return api.get(`/messages/conversations`);
};