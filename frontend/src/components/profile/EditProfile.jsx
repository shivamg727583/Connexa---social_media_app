import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { editProfile } from "@/features/auth/authThunks";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ bio: user?.bio || "", gender: user?.gender || "", profilePhoto: null });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((p) => ({ ...p, profilePhoto: file }));
  };

  const submitHandler = () => {
    const formData = new FormData();
    formData.append("bio", form.bio);
    formData.append("gender", form.gender);
    if (form.profilePhoto) formData.append("profilePicture", form.profilePhoto);

    dispatch(editProfile(formData)).then((res) => {
      if (!res.error) navigate(`/profile/${user._id}`);
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-2xl mx-auto px-4 sm:px-6">
      <section className="flex flex-col gap-4 sm:gap-6 w-full my-6 sm:my-8">
        <h1 className="font-bold text-xl sm:text-2xl">Edit Profile</h1>

        <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-900 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-xs text-gray-500">{user?.bio || "Add a bio"}</span>
            </div>
          </div>

          <input ref={imageRef} type="file" hidden accept="image/*" onChange={fileChangeHandler} />

          <Button size="sm" variant="outline" onClick={() => imageRef.current.click()} className="flex items-center gap-2 text-xs sm:text-sm">
            <Camera size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Change</span>
          </Button>
        </div>

        <div>
          <h2 className="font-semibold mb-2 text-sm sm:text-base">Bio</h2>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            className="bg-gray-100 dark:bg-neutral-900 border-none focus-visible:ring-0 text-sm sm:text-base"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2 text-sm sm:text-base">Gender</h2>
          <Select value={form.gender} onValueChange={(value) => setForm((p) => ({ ...p, gender: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button onClick={submitHandler} disabled={loading} className="min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin w-4 h-4" />
                Saving
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </section>
    </motion.div>
  );
};

export default EditProfile;