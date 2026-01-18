import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { createGroup } from "@/features/group/groupThunks";
import { toast } from "sonner";

const CreateGroupModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    description: "",
    privacy: "public",
  });
  const [coverPreview, setCoverPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description);
    formData.append("privacy", form.privacy);
    if (coverFile) formData.append("coverImage", coverFile);
    if (avatarFile) formData.append("avatar", avatarFile);

    await dispatch(createGroup(formData));
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">Create New Group</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Cover Image (Optional)
            </label>
            <div className="relative">
              <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl overflow-hidden">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/50" />
                  </div>
                )}
              </div>
              <label
                htmlFor="cover-upload"
                className="absolute bottom-3 right-3 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white shadow-lg rounded-full px-3 py-2 flex items-center gap-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Group Avatar (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full overflow-hidden flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white/50" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" className="cursor-pointer flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 transition-colors"
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-3 transition-colors outline-none"
              placeholder="Enter group name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-3 transition-colors outline-none resize-none"
              placeholder="What's your group about?"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Privacy
            </label>
            <select
              className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-3 transition-colors outline-none"
              value={form.privacy}
              onChange={(e) => setForm({ ...form, privacy: e.target.value })}
            >
              <option value="public">Public - Anyone can join</option>
              <option value="private">Private - Approval required</option>
            </select>
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
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              }`}
            >
              {loading ? "Creating..." : "Create Group"}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

CreateGroupModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateGroupModal;