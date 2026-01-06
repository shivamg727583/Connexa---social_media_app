import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings,
  Grid3x3,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  X,
  Check,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { fetchProfileById } from "@/features/auth/authThunks";
import { fetchAllPosts, deletePost } from "@/features/post/postThunks";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/features/friends/friendThunks";
import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, userProfile, loading: profileLoading } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);

  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = user?._id === userProfile?._id;
  const getButtonText = useButtonText();
  const getFriendStatus = useFriendStatus();
  const getRequestId = useFriendRequestId();

  useEffect(() => {
    dispatch(fetchProfileById(id));
    dispatch(fetchAllPosts());
  }, [dispatch, id]);

  const profilePosts = posts.filter(
    (post) => post.author?._id === userProfile?._id
  );

  const savedPosts = isOwnProfile
    ? posts.filter((post) => {
        const savedPostIds = user?.savedPosts || [];
        return savedPostIds.some((savedId) => String(savedId) === String(post._id));
      })
    : [];

  const displayedPosts = activeTab === "posts" ? profilePosts : savedPosts;

  const friendStatus = getFriendStatus(userProfile?._id);
  const buttonText = getButtonText(userProfile?._id);

  const handleFriendAction = () => {
    if (friendStatus === "follow") {
      dispatch(sendFriendRequest({ to: id }));
    } else if (friendStatus === "requested") {
      dispatch(cancelFriendRequest({ to: id }));
    } else if (friendStatus === "friends") {
      navigate(`/chat/${id}`);
    }
  };

  const handleAcceptRequest = () => {
    const requestId = getRequestId(userProfile?._id);
    if (requestId) {
      dispatch(acceptFriendRequest({ requestId }));
    }
  };

  const handleRejectRequest = () => {
    const requestId = getRequestId(userProfile?._id);
    if (requestId) {
      dispatch(rejectFriendRequest({ requestId }));
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost(postId));
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
    
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">
        <div className="flex justify-center sm:justify-start">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 ring-4 ring-gray-100 dark:ring-gray-800">
            <AvatarImage src={userProfile?.profilePicture} />
            <AvatarFallback className="text-4xl">
              {userProfile?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">{userProfile?.username}</h1>

            {isOwnProfile ? (
              <Link to="/account/edit">
                <Button variant="secondary" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
            ) : friendStatus === "accept" ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptRequest}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  onClick={handleRejectRequest}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleFriendAction}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {buttonText}
              </Button>
            )}
          </div>

          <div className="flex gap-8 text-center sm:text-left">
            <div>
              <p className="font-bold text-lg">{profilePosts.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
            </div>
            <Link to={`/profile/${userProfile?._id}/friends`}>
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <p className="font-bold text-lg">
                  {userProfile?.friends?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Friends
                </p>
              </div>
            </Link>
            {isOwnProfile && (
              <div>
                <p className="font-bold text-lg">{savedPosts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Saved</p>
              </div>
            )}
          </div>

          {userProfile?.bio && (
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {userProfile.bio}
              </p>
            </div>
          )}

          <Badge
            variant="secondary"
            className="w-fit flex items-center gap-1 px-3 py-1"
          >
            @{userProfile?.username}
          </Badge>
        </div>
      </div>

  
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center gap-12 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${
              activeTab === "posts"
                ? "border-gray-900 dark:border-white"
                : "border-transparent text-gray-400"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">POSTS</span>
          </button>

       
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${
                activeTab === "saved"
                  ? "border-gray-900 dark:border-white"
                  : "border-transparent text-gray-400"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">SAVED</span>
            </button>
          )}
        </div>
      </div>

    
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 mt-4">
        {displayedPosts.map((post) => {
          const isPostOwner = post.author?._id === user?._id;

          return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
            >
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="font-semibold">{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span className="font-semibold">
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>

            
              {isPostOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

           
              {activeTab === "saved" && (
                <div className="absolute top-2 left-2 p-2 bg-black/50 rounded-full">
                  <Bookmark className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    
      {displayedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          {activeTab === "posts" ? (
            <>
              <Grid3x3 className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No posts yet</p>
              {isOwnProfile && (
                <p className="text-sm">Share your first photo or video</p>
              )}
            </>
          ) : (
            <>
              <Bookmark className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No saved posts</p>
              <p className="text-sm">Save posts to see them here</p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProfilePage;