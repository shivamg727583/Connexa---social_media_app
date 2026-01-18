import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/formatTime";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import PropTypes from "prop-types";

const ConversationItem = ({ conv, isActive, isGroup, isOnline, lastMsg, isMyMessage, isTyping, onClick }) => (
    <motion.div
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
    >
        <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                <AvatarImage src={conv.picture} />
                <AvatarFallback>
                    {isGroup ? <Users className="w-5 h-5 sm:w-6 sm:h-6" /> : conv.name?.[0]}
                </AvatarFallback>
            </Avatar>

            {!isGroup && isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
            )}

            {isGroup && (
                <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center">
                    <Users className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </span>
            )}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm truncate">{conv.name}</p>
                {lastMsg && (
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(lastMsg.timestamp)}
                    </span>
                )}
            </div>

            <p className={`text-sm truncate ${isTyping ? "text-green-500 font-medium" : "text-gray-600"}`}>
                {isTyping ? "typing..." : lastMsg ? (
                    <>
                        {isMyMessage && "You: "}
                        {lastMsg.message}
                    </>
                ) : (
                    <span className="text-gray-400">No messages yet</span>
                )}
            </p>
        </div>
    </motion.div>
);

ConversationItem.propTypes = {
    conv: PropTypes.shape({
        picture: PropTypes.string,
        name: PropTypes.string.isRequired,
    }).isRequired,
    isActive: PropTypes.bool,
    isGroup: PropTypes.bool,
    isOnline: PropTypes.bool,
    lastMsg: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        message: PropTypes.string,
    }),
    isMyMessage: PropTypes.bool,
    isTyping: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ConversationItem

