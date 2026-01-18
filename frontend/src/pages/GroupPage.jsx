import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Shield } from "lucide-react";
import { fetchAllGroups, fetchMyGroups } from "@/features/group/groupThunks";
import { PageContainer, PageHeader, ContentWrapper, LoadingSpinner, EmptyState, TabNavigation } from "@/components/shared/PageLayout";
import GroupGrid from "@/components/group/GroupGrid";

const AdminPanel = lazy(() => import("@/components/group/GroupAdminPanel"));
const CreateGroupModal = lazy(() => import("@/components/modals/CreateGroupModal"));



const GroupsPage = () => {
  const dispatch = useDispatch();
  const { myGroups, allGroups, loading } = useSelector((s) => s.group);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMyGroups());
    dispatch(fetchAllGroups());
  }, [dispatch]);

  const tabs = [
    { id: "all", label: "Discover", icon: Users, count: allGroups?.length || 0 },
    { id: "my", label: "My Groups", icon: Shield, count: myGroups?.length || 0 },
    { id: "admin", label: "Admin Panel", icon: Shield },
  ];

  const renderContent = () => {
  if (loading && activeTab !== "admin") {
    return <LoadingSpinner />;
  }

  switch (activeTab) {
    case "all":
      return allGroups?.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups available"
          description="Be the first to create a group!"
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
            >
              Create Group
            </button>
          }
        />
      ) : (
        <GroupGrid groups={allGroups} isMyGroups={false} />
      );

    case "my":
      return myGroups?.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No groups yet"
          description="Join or create a group to get started!"
        />
      ) : (
        <GroupGrid groups={myGroups} isMyGroups={true} />
      );

    case "admin":
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminPanel />
        </Suspense>
      );

    default:
      return null;
  }
};


  return (
    <PageContainer>
      <PageHeader
        title="Groups"
        subtitle="Connect with communities"
        icon={Users}
        action={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline font-medium">Create Group</span>
            <span className="sm:hidden font-medium">Create</span>
          </motion.button>
        }
      />

      <ContentWrapper>
        <div className="mb-6">
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </ContentWrapper>

      <AnimatePresence>
        {showCreateModal && (
          <Suspense fallback={null}>
            <CreateGroupModal onClose={() => setShowCreateModal(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default GroupsPage;