import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchMyGroups,
  approveGroupMember,
  removeMember,
  cancelJoinRequest,
} from "@/features/group/groupThunks";
import { Crown, Users, Clock, UserMinus, Check, X, Settings } from "lucide-react";
import EditGroupModal from "@/components/modals/EditGroupModal";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { myGroups } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMyGroups());
  }, [dispatch]);

  const myAdminGroups = myGroups?.filter(
    (g) => g.adminId === user?._id || g.adminId?._id === user?._id
  ) || [];

  const myPendingRequests = myGroups?.filter(
    (g) => g.joinRequests?.some((req) => req._id === user?._id)
  ) || [];

  const handleApprove = async (groupId, memberId) => {
    await dispatch(approveGroupMember({ groupId, memberId, reject: false }));
    dispatch(fetchMyGroups());
  };

  const handleReject = async (groupId, memberId) => {
    await dispatch(approveGroupMember({ groupId, memberId, reject: true }));
    dispatch(fetchMyGroups());
  };

  const handleRemoveMember = async (groupId, memberId) => {
    await dispatch(removeMember({ groupId, memberId }));
    dispatch(fetchMyGroups());
  };

  const handleCancelRequest = async (groupId) => {
    await dispatch(cancelJoinRequest(groupId));
    dispatch(fetchMyGroups());
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };



  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Admin Groups</h2>
            <p className="text-gray-600 text-sm">
              Groups you manage ({myAdminGroups.length})
            </p>
          </div>
        </div>

        {myAdminGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No admin groups yet
            </h3>
            <p className="text-gray-500">Create a group to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAdminGroups.map((group) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members?.length || 0} members
                      </span>
                      {group.joinRequests?.length > 0 && (
                        <span className="flex items-center gap-1 text-purple-600 font-medium">
                          <Clock className="w-4 h-4" />
                          {group.joinRequests.length} pending
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditGroup(group)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Group
                  </motion.button>
                </div>

                {group.joinRequests?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Pending Join Requests
                    </h4>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {group.joinRequests.map((req) => (
                          <motion.div
                            key={req._id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={req.profilePicture || "/avatar.png"}
                                alt={req.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {req.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {req.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleApprove(group._id, req._id)}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReject(group._id, req._id)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {group.members?.length > 1 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Members
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.members
                        .filter((m) => m._id !== user?._id)
                        .map((member) => (
                          <div
                            key={member._id}
                            className="bg-white rounded-lg p-2 flex items-center justify-between shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={member.profilePicture || "/avatar.png"}
                                alt={member.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-sm font-medium text-gray-800">
                                {member.username}
                              </span>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveMember(group._id, member._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove member"
                            >
                              <UserMinus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {myPendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pending Requests
              </h2>
              <p className="text-gray-600 text-sm">
                Your join requests ({myPendingRequests.length})
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {myPendingRequests.map((group) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Waiting for admin approval
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCancelRequest(group._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel Request
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showEditModal && selectedGroup && (
          <EditGroupModal
            group={selectedGroup}
            onClose={() => {
              setShowEditModal(false);
              setSelectedGroup(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;