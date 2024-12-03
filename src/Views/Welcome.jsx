import React from "react";
import { useNavigate } from "react-router-dom";
import background from "../Views/images/backgroundImg.png";
import image1 from "../Views/images/image1.png";

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Login");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-left text-[14px] text-darkgray font-open-sans">
      <div
        className="absolute top-0 left-0 w-full h-screen"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white w-full max-w-[1420px] flex items-center justify-center py-1 box-border">
        <div className="relative">Powered by @cc, all rights are reserved</div>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center py-5 px-2.5 text-[32px] text-gray-100">
        <div className="w-[40%] h-[80%]  rounded-[20px] bg-white flex flex-col items-center justify-center py-8 gap-[24px] border-[4px] border-solid border-[#F5E3ED]">
          <div className="flex flex-col items-center justify-center gap-[10px] text-center">
            <div className="relative text-black font-semibold text-lg md:text-2xl">Welcome to Photo Booth</div>
            <div className="text-lg text-dimgray">
              <div className="relative text-[#6C6C6C] text-sm md:text-base">Capture, Customize & Print your moments with ease.</div>
            </div>
          </div>
          <div className="w-[30vw] h-[55vh] object-cover  relative rounded-[30px] bg-whitesmoke   overflow-hidden border-[4px] border-solid border-[#E9E9E9]">   
            <img
              className="absolute top-0 left-0 w-[100%] h-[100%] object-cover"
              alt="Example photo booth output"
              src={image1}
            />
          </div>
          
            <button className="w-[30vw] shadow-md rounded-lg h-[52px] text-lg md:text-base text-white bg-[#D672AC] leading-[150%] py-2 md:px-6" onClick={handleGetStarted}>Get Started</button>
      
        </div>
      </div>
    </div>
  );
};

export default Welcome;
