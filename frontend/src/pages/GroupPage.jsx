import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllGroups, fetchMyGroups } from "@/features/group/groupThunks";
import GroupCard from "@/components/group/GroupCard";
import MyGroupCard from "@/components/group/MyGroupCard";
import AdminPanel from "@/components/group/GroupAdminPanel";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { Plus } from "lucide-react";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const { myGroups, allGroups, loading } = useSelector((s) => s.group);
  const [activeTab, setActiveTab] = useState("Groups");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMyGroups());
    dispatch(fetchAllGroups());
  }, [dispatch]);

  const tabs = [
    { name: "Groups", count: allGroups?.length || 0 },
    { name: "My Groups", count: myGroups?.length || 0 },
    { name: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Groups
            </h1>
            <p className="text-gray-600 mt-2">Connect with communities</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Group</span>
          </motion.button>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto mb-8 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === tab.name
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow"
              }`}
            >
              {tab.name}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </motion.div>
          ) : (
            <>
              {activeTab === "Groups" && (
                <motion.div
                  key="all-groups"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {allGroups?.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🌐</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No groups available
                      </h3>
                      <p className="text-gray-500">
                        Be the first to create a group!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allGroups?.map((group) => (
                        <GroupCard key={group._id} group={group} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "My Groups" && (
                <motion.div
                  key="my-groups"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {myGroups?.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📂</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No groups yet
                      </h3>
                      <p className="text-gray-500">
                        Join or create a group to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myGroups?.map((group) => (
                        <MyGroupCard key={group._id} group={group} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "Admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminPanel />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateModal && (
            <CreateGroupModal onClose={() => setShowCreateModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GroupsPage;