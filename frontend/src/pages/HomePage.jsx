import { LoadingSpinner } from "@/components/shared/PageLayout";
import { lazy, Suspense } from "react";


const Feed = lazy(() => import("@/components/posts/Feed"));
const RightSidebar = lazy(() => import("@/components/layouts/RightSidebar"));

 const HomePage = () => (
  <div className="max-w-7xl mx-auto flex gap-4 lg:gap-8 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
        <Feed />
      </div>
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </Suspense>
  </div>
);

export default HomePage;






