import ClientButtons from "../../../components/ClientButtons";
import React from "react";
import PostContent from "@/components/Post_content";


const HomePage: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* buttons for changing the mode */}
      <div className="flex justify-center space-x-[5rem] fixed ml-[6rem] z-10">
        <ClientButtons />
      </div>
      {/* This section will contain infinite posts */}
      <div className="mt-[4.4rem] w-[36.5rem]">
        {/* <Post_content/> */}
        <PostContent />
      </div>
    </div>
  );
};

export default HomePage;
