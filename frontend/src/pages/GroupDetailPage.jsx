import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, MessageCircle, Grid, Crown, Lock, Globe, Plus } from "lucide-react";
import { fetchGroupById } from "@/features/group/groupThunks";
import BackButton from "@/components/ui/back-button";
import { LoadingSpinner, EmptyState, TabNavigation } from "@/components/shared/PageLayout";
import MemberCard from "@/components/group/MemberCard";

const GroupPostFeed = lazy(() => import("@/components/group/GroupPostFeed"));
const GroupChat = lazy(() => import("@/components/group/GroupChat"));
const CreatePostModal = lazy(() => import("@/components/modals/CreatePostModal"));



const GroupDetailPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedGroup, loading } = useSelector((s) => s.group);
  const { user } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (groupId) dispatch(fetchGroupById(groupId));
  }, [groupId, dispatch]);

  const isAdmin = useMemo(
    () => selectedGroup?.adminId?._id === user?._id || selectedGroup?.adminId === user?._id,
    [selectedGroup, user]
  );

  const isMember = useMemo(
    () => selectedGroup?.members?.some((m) => m?._id === user?._id || m === user?._id),
    [selectedGroup, user]
  );

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "members", label: "Members", icon: Users, count: selectedGroup?.members?.length || 0 },
  ];

  if (loading) return <LoadingSpinner size="lg" />;

  if (!selectedGroup) {
    return (
      <div className="h-screen flex items-center justify-center">
        <EmptyState title="Group not found" description="This group may have been deleted" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <GroupPostFeed groupId={groupId} />
          </Suspense>
        );

      case "chat":
        return isMember ? (
          <Suspense fallback={<LoadingSpinner />}>
            <GroupChat groupId={groupId} />
          </Suspense>
        ) : (
          <EmptyState title="Members only" description="Join the group to access chat" />
        );

      case "members":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {selectedGroup.members?.map((m) => (
              <MemberCard
                key={m?._id || m}
                member={m}
                onClick={() => navigate(`/profile/${m?._id || m}`)}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative h-40 sm:h-48 md:h-64">
        {selectedGroup.coverImage ? (
          <img src={selectedGroup.coverImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-500" />
        )}
        <BackButton className="absolute top-3 left-3 sm:top-4 sm:left-4" />
      </div>

      <div className="max-w-6xl relative z-10 mx-auto px-3 sm:px-4 lg:px-8 -mt-12 sm:-mt-16">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
          {!selectedGroup.avatar && (
            <img
              src={selectedGroup.avatar || "/avatar.png"}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-900 mx-auto sm:mx-0"
            />
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold">{selectedGroup.name}</h1>
              {isAdmin && (
                <span className="flex items-center gap-1 text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                  <Crown size={12} /> Admin
                </span>
              )}
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                {selectedGroup.privacy === "public" ? (
                  <><Globe size={12} /> Public</>
                ) : (
                  <><Lock size={12} /> Private</>
                )}
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
              {selectedGroup.description}
            </p>

            <p className="text-xs sm:text-sm text-gray-500">
              {selectedGroup.members?.length || 0} members
            </p>
          </div>

          {isMember && (
            <button
              onClick={() => setShowCreatePost(true)}
              className="self-start sm:self-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 hover:shadow-lg transition text-sm sm:text-base"
            >
              <Plus size={16} /> Post
            </button>
          )}
        </div>

        <div className="mt-4 sm:mt-6">
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 sm:mt-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {showCreatePost && (
        <Suspense fallback={null}>
          <CreatePostModal onClose={() => setShowCreatePost(false)} groupId={groupId} />
        </Suspense>
      )}
    </div>
  );
};

export default GroupDetailPage;