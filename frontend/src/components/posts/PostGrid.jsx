import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const PostGrid = ({ posts, onDelete, isOwner, activeTab }) => (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 mt-4">
        {posts.map((post) => (
            <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
            >
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 sm:gap-6 text-white">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                        <span className="font-semibold text-sm sm:text-base">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                        <span className="font-semibold text-sm sm:text-base">{post.comments?.length || 0}</span>
                    </div>
                </div>

                {isOwner && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="absolute top-2 right-2 p-1.5 sm:p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onDelete(post._id)} className="text-red-600 focus:text-red-600">
                                Delete Post
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {activeTab === "saved" && (
                    <div className="absolute top-2 left-2 p-1.5 sm:p-2 bg-black/50 rounded-full">
                        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                    </div>
                )}
            </motion.div>
        ))}
    </div>
);


PostGrid.propTypes = {
    posts: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    isOwner: PropTypes.bool.isRequired,
    activeTab: PropTypes.string.isRequired,
};

export default PostGrid;