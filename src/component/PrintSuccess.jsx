
import React, {  useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Header from "../Views/Header/Header";
import image20 from "../Views/images/image20.png";
import {  Image } from "lucide-react";
import { auth } from "../Views/FireBase/Firebase";

const PrintSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


const handlegobackbutton = () =>{
  navigate("/Home");
}


  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        // Handle error gracefully, show toast or alert
      });
  };

  return (
    <div className="flex flex-col h-[100vh] bg-[#FFFBF7]">
      <Header handleLogout={handleLogout} disableLink={true} />

      <div className="flex flex-col h-[50%] items-center justify-center flex-grow text-center px-4 py-4 sm:px-6 lg:px-8">
       
        
        <div className="flex flex-col h-[85%] items-center min-h-fit w-full max-w-md p-4 bg-white border-4 rounded-2xl border-[#F5E3ED] sm:p-6">
          <h2 className="mb-2 text-lg font-semibold text-black md:text-xl">
          Your Photos Printed Sucessfully
          </h2>
         
          
          <div className="flex flex-col justify-center min-h-fit h-[80%] items-center w-full p-1 mb-4 bg-[#fbfbfb] border-2 rounded-xl">
            <p className="mb-2 text-[2.5vw] font-semibold  lg:text-[0.7vw] text-center text-[#6c6c6c] md:text-[1.2vw]">
            Go back to home and customise more photos.

            </p>
            <div className="flex items-center justify-center h-[80%] w-[80%] mb-4">
              <img className="w-[83%] h-83%]" alt="Example photo booth output" src={image20} />
            </div>
          </div>

          <div className="flex justify-center w-full gap-4">
            <button
              className="flex items-center justify-center w-[100%] h-12 px-2 py-1 text-[3.7vw] text-sm font-bold text-white rounded-lg shadow-md bg-[#D672AC] md:text-base "
           onClick={handlegobackbutton}
              disabled={loading}
            >
              {loading ? (
                <CgSpinner className="animate-spin" size={20} />
              ) : (
                <Image className="w-10 h-6 " />
              )}
              Go back to Home page
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center w-full py-2 bg-white">
        <span className="text-xs md:text-sm">
          Powered by @cc, all rights are reserved
        </span>
      </div>
    </div>
  );
};

export default PrintSuccess;
