const FriendSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 animate-pulse">
      <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-neutral-800 mx-auto mb-4" />
      <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 mx-auto mb-2" />
      <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 mx-auto mb-4" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 flex-1 bg-gray-200 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
};

export default FriendSkeleton;
