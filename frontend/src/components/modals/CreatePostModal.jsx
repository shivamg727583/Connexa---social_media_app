import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { X, Image as ImageIcon } from "lucide-react";
import { createPost } from "@/features/post/postThunks";
import { toast } from "sonner";

const CreatePostModal = ({ onClose, groupId = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);
    
    if (groupId) {
      formData.append("contextType", "GROUP");
      formData.append("contextId", groupId);
    }

    await dispatch(createPost(formData));
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
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {groupId ? "Create Group Post" : "Create Post"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePicture || "/avatar.png"}
              alt={user?.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.username}</p>
              <p className="text-sm text-gray-500">
                {groupId ? "Posting to group" : "Public post"}
              </p>
            </div>
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-3 transition-colors outline-none resize-none"
            placeholder="What's on your mind?"
            rows={3}
          />

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload image
              </p>
              <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
            </label>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="px-6 pb-6">
          <motion.button
            type="submit"
            disabled={loading || !imageFile}
            whileHover={{ scale: loading || !imageFile ? 1 : 1.02 }}
            whileTap={{ scale: loading || !imageFile ? 1 : 0.98 }}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading || !imageFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

CreatePostModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  groupId: PropTypes.string,
};

export default CreatePostModal;