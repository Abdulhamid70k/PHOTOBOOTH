import React, { useState } from "react";
import Camera from "../component/Camera";
import Header from "../Views/Header/Header";
import { auth } from "./FireBase/Firebase";
import { useNavigate } from "react-router-dom";

const Cameraview = () => {
  const [showModal, setShowModal] = useState(false);
 const navigate = useNavigate();
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
    <div className="bg-[#FFFBF7] h-screen flex flex-col justify-between relative">
      <div className="navbar-container">
        <Header handleLogout ={handleLogout} />
      </div>

      <div className="bg-[#FFFBF7] flex justify-center items-center w-full h-full">
        <Camera setShowModal={setShowModal} showModal={showModal} />
      </div>

      <div className="footer bg-white w-full h-12 flex justify-center items-center text-center">
        Powered by @cc, all rights are reserved
      </div>
    </div>
  );
};

export default Cameraview;
