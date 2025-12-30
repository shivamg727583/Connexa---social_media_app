const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-950 border dark:border-neutral-800 rounded-xl p-4 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-300" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
      </div>

      <div className="h-[300px] bg-gray-300 rounded" />

      <div className="h-4 w-32 bg-gray-300 rounded" />
      <div className="h-4 w-48 bg-gray-300 rounded" />
    </div>
  );
};

export default PostSkeleton;
