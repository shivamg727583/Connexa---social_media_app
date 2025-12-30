import api from "@/services/api";

export const getNotificationsApi = (page,limit)=> api.get(`notifications?page=${page}&limit=${limit}`)

export const markNotificationsAsReadAPi = (notificationId)=> api.patch(`notifications/${notificationId}/read`);

export const markAllNotificationsAsReadAPi = ()=> api.patch(`notifications/read-all`);


export const deleteNotificationApi = (notificationId)=> api.delete(`notifications/${notificationId}`);
