
import RightsideBar from "../../../components/RightsideBar";
import ClientButtons from "../../../components/ClientButtons";

export default function HomePage(){
  
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