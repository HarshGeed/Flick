
import RightsideBar from "../../../components/RightsideBar";
import ClientButtons from "../../../components/ClientButtons";
import React from "react";

const HomePage: React.FC = () => {
  
  return(
    <div className="flex">
    <div className=" h-screen w-[36.5rem]">
      {/* buttons for changing the mode */}
      <div className="flex justify-center space-x-[5rem] ">
       <ClientButtons/>
      </div>
    </div>
    {/* <RightsideBar/> */}
    </div>
  )
}

export default HomePage;