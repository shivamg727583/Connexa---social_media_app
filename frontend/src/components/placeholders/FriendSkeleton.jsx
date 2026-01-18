const FriendSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 animate-pulse">
    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-200 dark:bg-neutral-800 mx-auto mb-3 sm:mb-4" />
    <div className="h-3 w-20 sm:h-4 sm:w-24 bg-gray-200 dark:bg-neutral-800 mx-auto mb-2" />
    <div className="h-2 w-12 sm:h-3 sm:w-16 bg-gray-200 dark:bg-neutral-800 mx-auto mb-3 sm:mb-4" />
    <div className="flex gap-2">
      <div className="h-7 sm:h-8 flex-1 bg-gray-200 dark:bg-neutral-800 rounded" />
      <div className="h-7 sm:h-8 flex-1 bg-gray-200 dark:bg-neutral-800 rounded" />
    </div>
  </div>
);

export default FriendSkeleton;