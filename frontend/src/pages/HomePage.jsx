
import RightSidebar from "@/components/RightSidebar";
import Feed from "@/components/Feed";


const HomePage = () => {

  return (
    <div className="max-w-5xl mx-auto flex gap-8 px-4 py-6">
      <div className="flex-1 space-y-6">
        <Feed />
      </div>
      <RightSidebar />
    </div>
  );
};

export default HomePage;
