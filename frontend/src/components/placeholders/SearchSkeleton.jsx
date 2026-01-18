
function SearchSkeleton() {
  return (
    <div className="space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-2xl animate-pulse">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-2 sm:h-3 w-16 sm:w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    ))}
  </div>
  )
}

export default SearchSkeleton