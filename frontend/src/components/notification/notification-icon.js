import  { Heart, MessageCircle, UserPlus, Users } from "lucide-react";

export const NOTIFICATION_ICONS = {
  post_like: { component: Heart, color: "red", bgColor: "bg-red-100 dark:bg-red-900/30", textColor: "text-red-500" },
  post_comment: { component: MessageCircle, color: "blue", bgColor: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-500" },
  friend_request: { component: UserPlus, color: "green", bgColor: "bg-green-100 dark:bg-green-900/30", textColor: "text-green-500" },
  friend_accept: { component: Users, color: "purple", bgColor: "bg-purple-100 dark:bg-purple-900/30", textColor: "text-purple-500" },
};