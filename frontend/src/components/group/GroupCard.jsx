import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Users, Lock, Globe, UserPlus, Clock } from "lucide-react";
import { joinGroup, cancelJoinRequest } from "@/features/group/groupThunks";

const GroupCard = ({ group }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isRequested, setIsRequested] = useState(
    group?.joinRequests?.some((req) => req._id === user?._id) || false
  );

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    
    if (isRequested) {
      await dispatch(cancelJoinRequest(group._id));
      setIsRequested(false);
    } else {
      await dispatch(joinGroup(group._id));
      if (group.privacy === "public") {
        setIsRequested(false);
      } else {
        setIsRequested(true);
      }
    }
  };

  const handleCardClick = () => {
    if (group.privacy === "public") {
      navigate(`/groups/${group._id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
        group.privacy === "public" ? "cursor-pointer" : "cursor-default"
      } transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
        {group.coverImage ? (
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-16 h-16 text-white/30" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              group.privacy === "public"
                ? "bg-green-500 text-white"
                : "bg-gray-900/80 text-white backdrop-blur-sm"
            }`}
          >
            {group.privacy === "public" ? (
              <>
                <Globe className="w-3 h-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Private
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {group.members?.length || 0} members
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinClick}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
              isRequested
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            }`}
          >
            {isRequested ? (
              <>
                <Clock className="w-4 h-4" />
                Requested
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Join
              </>
            )}
          </motion.button>
        </div>
      </div>

      {group.privacy === "private" && (
        <div className="px-5 pb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              This is a private group. Join request needs admin approval.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

GroupCard.propTypes = {
  group: PropTypes.object.isRequired,
};

export default GroupCard;