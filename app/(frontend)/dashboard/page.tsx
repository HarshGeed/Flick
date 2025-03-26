import RightsideBar from "../../../components/RightsideBar";
import ClientButtons from "../../../components/ClientButtons";
import React from "react";
import PostCard from "@/components/PostCard";
import avatar from "@/public/avatar.jpg"

const HomePage: React.FC = () => {
  
  return(
    <div className="flex">
    <div className=" h-screen w-[36.5rem]">
      {/* buttons for changing the mode */}
      <div className="flex justify-center space-x-[5rem] fixed ml-[6rem] z-10">
       <ClientButtons/>
      </div>
      {/* This section will contain infinite posts */}
      <div className="mt-[4rem]">
        <PostCard user="Harsh"  content="This is the content mf" postImage={avatar}/>
      </div>
    </div>
    {/* <RightsideBar/> */}
    </div>
  )
}

export default HomePage;