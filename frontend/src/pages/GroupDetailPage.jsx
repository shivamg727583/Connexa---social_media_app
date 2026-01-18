import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Grid,
  ChevronLeft,
  Crown,
  Lock,
  Globe,
  Plus,
} from "lucide-react";

import { fetchGroupById } from "@/features/group/groupThunks";
import GroupPostFeed from "@/components/group/GroupPostFeed";
import GroupChat from "@/components/group/GroupChat";
import CreatePostModal from "@/components/modals/CreatePostModal";
import BackButton from "@/components/ui/back-button";

const TABS = [
  { id: "Posts", icon: Grid },
  { id: "Chat", icon: MessageCircle },
  { id: "Members", icon: Users },
];

const GroupDetailPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedGroup, loading } = useSelector((s) => s.group);
  const { user } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState("Posts");
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (groupId) dispatch(fetchGroupById(groupId));
  }, [groupId, dispatch]);

  const isAdmin = useMemo(
    () =>
      selectedGroup?.adminId?._id === user?._id ||
      selectedGroup?.adminId === user?._id,
    [selectedGroup, user]
  );

  const isMember = useMemo(
    () =>
      selectedGroup?.members?.some(
        (m) => m?._id === user?._id || m === user?._id
      ),
    [selectedGroup, user]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Group not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="relative h-48 sm:h-64">
        {selectedGroup.coverImage ? (
          <img
            src={selectedGroup.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-500" />
        )}

       <BackButton className="absolute top-4 left-4" />
      </div>

     
      <div className="max-w-6xl relative mx-auto px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row gap-4">
          {selectedGroup.avatar && (
            <img
              src={selectedGroup.avatar}
              alt=""
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>

              {isAdmin && (
                <span className="flex items-center gap-1 text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                  <Crown size={12} /> Admin
                </span>
              )}

              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100">
                {selectedGroup.privacy === "public" ? (
                  <>
                    <Globe size={12} /> Public
                  </>
                ) : (
                  <>
                    <Lock size={12} /> Private
                  </>
                )}
              </span>
            </div>

            <p className="text-gray-600 mt-1">
              {selectedGroup.description}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {selectedGroup.members?.length || 0} members
            </p>
          </div>

          {isMember && (
            <button
              onClick={() => setShowCreatePost(true)}
              className="self-start sm:self-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-full flex items-center gap-2"
            >
              <Plus size={18} /> Post
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mt-6 overflow-x-auto">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm whitespace-nowrap transition
                ${
                  activeTab === id
                    ? "bg-purple-600 text-white"
                    : "bg-white shadow"
                }`}
            >
              <Icon size={16} />
              {id}
            </button>
          ))}
        </div>

      
        <div className="mt-6 ">
          {activeTab === "Posts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GroupPostFeed groupId={groupId} />
            </motion.div>
          )}

          {activeTab === "Chat" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {isMember ? (
                <GroupChat groupId={groupId} />
              ) : (
                <div className="bg-white p-10 rounded-xl text-center shadow">
                  Members only chat
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "Members" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {selectedGroup.members?.map((m, i) => {
                const id = m?._id || m;
                return (
                  <div
                    key={id || i}
                    onClick={() => navigate(`/profile/${id}`)}
                    className="bg-white p-3 rounded-xl flex items-center gap-3 cursor-pointer shadow-sm"
                  >
                    <img
                      src={m?.profilePicture || "/avatar.png"}
                      className="w-12 h-12 rounded-full"
                    />
                    <span className="font-medium truncate">
                      {m?.username || "User"}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default GroupDetailPage;
