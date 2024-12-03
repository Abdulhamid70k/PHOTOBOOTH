import { collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "./FireBase/Firebase";
import Header from "./Header/Header";
import image20 from "../Views/images/image20.png";
import { Camera, Image } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        console.log("User is signed in");
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateUniqueString = () => {
    const uniqueString = uuidv4();
    return uniqueString;
  };

  const handleClickPhoto = () => {
    navigate("/CameraView");
  };

  const handleUploadPhoto = async () => {
    setLoading(true);
    const uniqueString = generateUniqueString();
    try {
      const user = auth.currentUser;
      if (user) {
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, user.uid);
        await setDoc(
          userDocRef,
          {
            CurrentProcess: {
              QRCodeUniqueString: uniqueString,
              isQRCodeScanned: false,
              photoLink: "",
              photoUploaded: false,
              isDelete: false,
              disablePhotoUpload: false,
              isCancelled: false,
            },
          },
          { merge: true }
        );
        navigate(`/QRCode?id=${uniqueString}`);
      } else {
        console.error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold  md:text-[2vw] text-[#720C47] lg:mt-[-2%] mb-4">
          Welcome to our Photo Booth
        </h1>
        
        <div className="flex flex-col h-[85%] items-center min-h-fit w-full max-w-md p-4 bg-white border-4 rounded-2xl border-[#F5E3ED] sm:p-6">
          <h2 className="mb-2 text-lg font-semibold text-black md:text-xl">
            Click or Upload your Photo
          </h2>
          <p className="mb-2 text-[3vw] text-[#6C6C6C] md:text-base">
            Capture, Customize & Print your moments with ease.
          </p>
          
          <div className="flex flex-col justify-center min-h-fit h-[80%] items-center w-full p-1 mb-4 bg-[#fbfbfb] border-2 rounded-xl">
            <p className="mb-2 text-[2.5vw] font-semibold  lg:text-[0.7vw] text-center text-[#6c6c6c] md:text-[1.2vw]">
              Select click/upload photo option to capture & select frames with ease
            </p>
            <div className="flex items-center justify-center h-[80%] w-[80%] mb-4">
              <img className="w-[83%] h-83%]" alt="Example photo booth output" src={image20} />
            </div>
          </div>

          <div className="flex justify-center w-full gap-4">
            <button
              className="flex items-center justify-center w-1/2 h-10 px-2 py-1 text-sm font-bold text-white rounded-lg shadow-md bg-[#D672AC] md:text-base"
              onClick={handleClickPhoto}
            >
              {loading ? (
                <CgSpinner className="animate-spin" size={20} />
              ) : (
                <Camera className="w-6 h-6 mr-2" />
              )}
              Click photo
            </button>

            <button
              className="flex items-center justify-center w-1/2 h-10 px-2 py-1 text-[3.7vw] text-sm font-bold text-white rounded-lg shadow-md bg-[#D672AC] md:text-base "
              onClick={handleUploadPhoto}
              disabled={loading}
            >
              {loading ? (
                <CgSpinner className="animate-spin" size={20} />
              ) : (
                <Image className="w-6 h-6 mr-2" />
              )}
              Upload Photo
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

export default Home;
