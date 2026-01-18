import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Users, Crown, Lock, Globe } from "lucide-react";

const MyGroupCard = ({ group }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = group?.adminId === user?._id || group?.adminId?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/groups/${group._id}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
    >
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
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

        <div className="absolute top-3 right-3 flex gap-2">
          {isAdmin && (
            <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
              <Crown className="w-3 h-3" />
              Admin
            </div>
          )}
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

        {group.avatar && (
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className={`p-5 ${group.avatar ? "pt-10" : ""}`}>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {group.name}
        </h3>

        {group.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {group.description}
          </p>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              {group.members?.length || 0} members
            </span>
          </div>

          {group.joinRequests?.length > 0 && isAdmin && (
            <div className="flex items-center gap-2 text-purple-600">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-sm font-medium">
                {group.joinRequests.length} pending
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

MyGroupCard.propTypes = {
  group: PropTypes.object.isRequired,
};

export default MyGroupCard;