import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { updateGroupCover, updateGroupAvatar } from "@/features/group/groupThunks";
import { toast } from "sonner";

const EditGroupModal = ({ group, onClose }) => {
  const dispatch = useDispatch();
  const [coverPreview, setCoverPreview] = useState(group.coverImage || "");
  const [avatarPreview, setAvatarPreview] = useState(group.avatar || "");
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (coverFile) {
        const formData = new FormData();
        formData.append("image", coverFile);
        await dispatch(updateGroupCover({ groupId: group._id, formData }));
      }

      if (avatarFile) {
        const formData = new FormData();
        formData.append("image", avatarFile);
        await dispatch(updateGroupAvatar({ groupId: group._id, formData }));
      }

      toast.success("Group updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update group");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit Group</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Cover Image
            </label>
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl overflow-hidden">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
              <label
                htmlFor="cover-upload"
                className="absolute bottom-4 right-4 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Upload Cover
                </motion.div>
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 1200x400px. Max 5MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Group Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full overflow-hidden flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer flex-1"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Avatar
                </motion.div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 400x400px. Max 5MB.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={uploading || (!coverFile && !avatarFile)}
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
                uploading || (!coverFile && !avatarFile)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              }`}
            >
              {uploading ? "Updating..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

EditGroupModal.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditGroupModal;