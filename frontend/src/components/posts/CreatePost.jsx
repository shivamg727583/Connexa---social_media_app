import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { createPost } from "@/features/post/postThunks";

const CreatePost = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.post);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fileChangeHandler = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(await readFileAsDataURL(selected));
  };

  const submitHandler = () => {
    if (!preview) return;
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);
    dispatch(createPost(formData)).then((res) => {
      if (!res.error) {
        setCaption("");
        setFile(null);
        setPreview("");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="bg-white dark:bg-neutral-950 max-w-md sm:max-w-lg">
        <DialogHeader className="text-center font-semibold text-base sm:text-lg">Create New Post</DialogHeader>

        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs sm:text-sm">{user?.username}</h1>
            <span className="text-xs text-gray-500">Share something new</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="resize-none border-none focus-visible:ring-0 bg-gray-100 dark:bg-neutral-900 text-sm sm:text-base"
        />

        {preview && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-48 sm:h-64 rounded-lg overflow-hidden">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          </motion.div>
        )}

        <input ref={imageRef} type="file" accept="image/*" hidden onChange={fileChangeHandler} />

        <div className="flex flex-col gap-2 sm:gap-3">
          <Button variant="outline" onClick={() => imageRef.current.click()} className="flex items-center gap-2 text-xs sm:text-sm">
            <ImagePlus size={16} className="sm:w-[18px] sm:h-[18px]" />
            Select from computer
          </Button>

          {preview && (
            <Button onClick={submitHandler} disabled={loading} className="w-full text-sm sm:text-base">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

CreatePost.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default CreatePost;