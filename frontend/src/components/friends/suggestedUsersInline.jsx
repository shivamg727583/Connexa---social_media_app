import { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import SuggestedUserInlineCard from "@/components/friends/SuggestedUserInlineCard";
const SuggestedUsersInline = memo(() => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  if (!suggestedUsers?.length) return null;

  return (
    <section
      className="
        xl:hidden
        relative
        my-6
        sm:my-8
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Suggested for you
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Discover people you may know
          </p>
        </div>

        <Link
          to="/suggested"
          className="
            flex
            items-center
            gap-1
            text-sm
            font-medium
            text-purple-600
            hover:text-purple-700
            dark:text-purple-400
            dark:hover:text-purple-300
            transition-colors
          "
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div
        className="
          flex
          gap-4
          overflow-x-auto
          scrollbar-hide
          snap-x
          snap-mandatory
          pb-2
          -mx-1
          px-1
        "
      >
        {suggestedUsers.slice(0, 10).map((user) => (
          <div
            key={user._id}
            className="
              min-w-[260px]
              max-w-[260px]
              snap-start
              flex-shrink-0
            "
          >
            <SuggestedUserInlineCard user={user} />
          </div>
        ))}
      </div>
    </section>
  );
});

SuggestedUsersInline.displayName = "SuggestedUsersInline";

export default SuggestedUsersInline;