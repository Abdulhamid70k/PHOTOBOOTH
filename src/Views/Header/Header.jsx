import React from "react";
import Rectangle2 from "../images/Rectangle2.png";
import { LogOut } from "lucide-react";

const Header = ({ handleLogout }) => {
  return (
    <header className="w-full flex justify-center">
      <div className="flex items-center justify-between bg-white w-full py-2 px-4 md:px-8">
        <div className="flex items-center">
          <img className="h-11 w-11" src={Rectangle2} alt="Logo" />
          <button className="bg-transparent text-xl md:text-2xl h-10 flex text-center whitespace-nowrap ml-2 font-semibold">
            Photo Booth
          </button>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="shadow-md font-semibold text-xs md:text-base flex items-center justify-center bg-[#D672AC] rounded-lg h-10 md:h-12 w-24 md:w-32 text-white p-1"
          >
            <LogOut
              strokeWidth={1}
              className="transform rotate-180 mr-2"
            />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
