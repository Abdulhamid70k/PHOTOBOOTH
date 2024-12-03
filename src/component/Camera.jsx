import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import cameraclick from "../Views/images/cameraclick.png";
import ImagePopup from "./ImagePopup";
import { ArrowLeft } from "lucide-react";

const Camera = () => {
  const [isPermissionGiven, setIsPermissionGiven] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = React.useRef(null);

  const navigate = useNavigate();

  const handleUserMedia = (mediaStream) => {
    if (mediaStream) {
      setIsPermissionGiven(true);
    } else {
      setIsPermissionGiven(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowModal(true); // Show the modal after capturing the image
  }, [webcamRef]);

  const handleProceed = (numCopies) => {
    // Perform any necessary actions with the captured image and number of copies
    console.log("Captured Image:", capturedImage);
    console.log("Number of Copies:", numCopies);
  };

  const handleClose = () => {
    navigate('/Home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-4">
      <h2 className="text-[#720C47] text-3xl font-semibold font-opensans">
        Capture Photo
      </h2>
      <button
              className="close-button absolute top-[12%] left-[2%]  bg-transparent border-none cursor-pointer p-1.5 rounded-full shadow-md"
              onClick={handleClose}
            >
              <ArrowLeft size={24} color="black" />
            </button>
      <div className="camera-container flex flex-col items-center justify-center w-[90%] h-full max-w-4xl rounded-lg relative">
     

        {!showModal && (
          <div className="webcam-wrapper flex items-center justify-center flex-col bg-transparent relative w-full h-full max-w-full overflow-hidden rounded-lg">
            
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              onUserMedia={handleUserMedia}
              className="w-full h-auto max-w-[90vw] max-h-[70vh] object-cover rounded-t-lg"
            />

            <div className="capture-button-container bg-black bottom-2 w-full flex items-center justify-center rounded-b-lg h-20">
              <img
                className="relative capture-icon h-16 w-16"
                src={cameraclick}
                alt="Capture"
              />
              {isPermissionGiven && (
                <button
                  className="absolute capture-button bg-transparent border-none h-16 w-16 rounded-full cursor-pointer outline-none"
                  onClick={capture}
                ></button>
              )}
            </div>
          </div>
        )}
      </div>
      {!isPermissionGiven && (
        <div>Please give permission to access the camera</div>
      )}
      {showModal && (
        <ImagePopup
          setShowModal={setShowModal}
          showModal={showModal}
          onClose={() => setShowModal(false)}
          onProceed={handleProceed}
          capturedImage={capturedImage}
        />
      )}
    </div>
  );
};

export default Camera;
