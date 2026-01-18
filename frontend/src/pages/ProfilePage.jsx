import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Settings, Grid3x3, Bookmark, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProfileById } from "@/features/auth/authThunks";
import { fetchAllPosts, deletePost } from "@/features/post/postThunks";
import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, rejectFriendRequest } from "@/features/friends/friendThunks";
import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";
import { PageContainer, LoadingSpinner, EmptyState} from "@/components/shared/PageLayout";
import PostGrid from "@/components/posts/PostGrid";
import ProfileStats from "@/components/profile/ProfileStats";


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

  const profilePosts = useMemo(
    () => posts.filter((post) => post.author?._id === userProfile?._id),
    [posts, userProfile]
  );

  const savedPosts = useMemo(() => {
    if (!isOwnProfile) return [];
    const savedPostIds = user?.savedPosts || [];
    return posts.filter((post) => savedPostIds.some((savedId) => String(savedId) === String(post._id)));
  }, [posts, user, isOwnProfile]);

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
    if (requestId) dispatch(acceptFriendRequest({ requestId }));
  };

  const handleRejectRequest = () => {
    const requestId = getRequestId(userProfile?._id);
    if (requestId) dispatch(rejectFriendRequest({ requestId }));
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost(postId));
    }
  };

  const tabs = [
    { id: "posts", label: "POSTS", icon: Grid3x3 },
    ...(isOwnProfile ? [{ id: "saved", label: "SAVED", icon: Bookmark }] : []),
  ];

  if (profileLoading) return <LoadingSpinner size="lg" />;

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-8 sm:mb-10">
          <div className="flex justify-center sm:justify-start">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 ring-4 ring-gray-100 dark:ring-gray-800">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback className="text-2xl sm:text-4xl">
                {userProfile?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold">{userProfile?.username}</h1>

              {isOwnProfile ? (
                <Link to="/account/edit">
                  <Button variant="secondary" className="gap-2 text-sm sm:text-base">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
              ) : friendStatus === "accept" ? (
                <div className="flex gap-2">
                  <Button onClick={handleAcceptRequest} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 text-sm sm:text-base">
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button onClick={handleRejectRequest} variant="outline" className="gap-2 text-sm sm:text-base">
                    <X className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              ) : (
                <Button onClick={handleFriendAction} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base">
                  {buttonText}
                </Button>
              )}
            </div>

            <ProfileStats
              posts={profilePosts.length}
              friends={userProfile?.friends?.length || 0}
              saved={savedPosts.length}
              isOwnProfile={isOwnProfile}
            />

            {userProfile?.bio && (
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{userProfile.bio}</p>
            )}

            <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
              @{userProfile?.username}
            </Badge>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-center gap-8 sm:gap-12 text-xs sm:text-sm font-semibold">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 sm:py-4 border-t-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-gray-900 dark:border-white"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {displayedPosts.length === 0 ? (
          <EmptyState
            icon={activeTab === "posts" ? Grid3x3 : Bookmark}
            title={activeTab === "posts" ? "No posts yet" : "No saved posts"}
            description={
              activeTab === "posts"
                ? isOwnProfile
                  ? "Share your first photo or video"
                  : "No posts to show"
                : "Save posts to see them here"
            }
          />
        ) : (
          <PostGrid
            posts={displayedPosts}
            onDelete={handleDeletePost}
            isOwner={isOwnProfile}
            activeTab={activeTab}
          />
        )}
      </div>
    </PageContainer>
  );
};


export default ProfilePage;