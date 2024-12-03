import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import { validate as uuidValidate } from "uuid";
import Rofabs from "../assets/ROFABS.jpg";
import { auth, db } from "./FireBase/Firebase";
import Header from "./Header/Header";
import Steps from "../Views/images/steps.svg";
import ImagePopup from "../component/ImagePopup";
import { ArrowLeft } from "lucide-react";

const QRCodeComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uniqueString = new URLSearchParams(location.search).get("id");
  const redirectUrl = `https://photobooth-firebase.vercel.app/redirect?id=${uniqueString}`;

  const [validation, setValidation] = useState(null);
  const [isQRCodeScanned, setIsQRCodeScanned] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoLink, setPhotoLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setValidation(uuidValidate(uniqueString));

          const userRef = doc(db, "users", user.uid);
          const unsubscribeFromSnapshot = onSnapshot(
            userRef,
            (doc) => {
              const currentProcess = doc.data().CurrentProcess;

              setIsQRCodeScanned(currentProcess.isQRCodeScanned);
              setPhotoUploaded(currentProcess.photoUploaded);
              setPhotoLink(currentProcess.photoLink || "");
              setIsCancelled(currentProcess.isCancelled || false);
            },
            (error) => {
              console.error("Error fetching real-time data:", error);
            }
          );

          setUnsubscribeSnapshot(() => unsubscribeFromSnapshot);

          return () => {
            unsubscribeFromSnapshot();
          };
        } else {
          navigate("/login");
        }
      },
      (error) => {
        console.error("Error checking authentication state:", error);
      }
    );

    return unsubscribe;
  }, [navigate, uniqueString]);

  const handleGoBack = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, user.uid);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
        await setDoc(userDocRef, {
          CurrentProcess: {
            isDelete: true,
          },
        });
        navigate("/Home");
      } else {
        console.log("User is not authenticated");
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  };

  const handleProcessedWithPhoto = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          "CurrentProcess.disablePhotoUpload": true,
        });
        navigate(`/SelectFrame?id=${uniqueString}`, {
          state: { photoLink: photoLink },
        });
      } else {
        console.log("User is not authenticated");
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  };

  const handleBackButtonClick = () => {
    navigate('/Home');
  };

  return (
    <div className="flex flex-col bg-[#FFFBF7] min-h-screen">
      <Header handleLogout={handleLogout} />

      <div
        style={{height:"5%", width:"2.5%", padding:"0.2%",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%" }}
        className="back-button-container">
          <ArrowLeft onClick={handleBackButtonClick} size={24} color="black" />
        </div>

      {validation === null ? (
        <main className="flex-1 flex flex-col  items-center justify-center">
          <p>Loading...</p>
        </main>
      ) : validation ? (
        isCancelled ? (
          <main className="flex-1 flex flex-col items-center justify-center">
            <p>
              You have cancelled the process. Thank you for using our service.
            </p>
            {setTimeout(() => {
              navigate("/Home");
            }, 3000)}
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center">
            {!isQRCodeScanned ? (
              <>
                <div className="absolute left-1/2 top-[13%] transform -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-2xl text-[#720C47]">
                  <h1 className="text-lg md:text-2xl">Scan QR Code</h1>
                </div>

                <div className="absolute left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 bg-[#fbfbfb] max-w-[624px] rounded-[20px] flex flex-col items-center justify-center py-8 border-[2px] border-[#F5E3ED] w-[24vw] h-[42vh]">
                  <div className="font-open-sans text-center text-[#707070] text-sm md:text-base w-full mb-4">
                    <h3 className="text-[0.7vw]">
                      Please scan QR code & select photos from your device to
                      upload.
                    </h3>
                  </div>

                  <QRCode value={redirectUrl} size={230} />
                </div>

                <div className="absolute left-1/2 bottom-[6%] transform -translate-x-1/2 w-[65vh] h-[30vh]">
                  <img
                    className="w-full h-full object-cover"
                    src={Steps}
                    alt="Steps"
                  />
                </div>

                <div className="absolute bottom-0 left-0 w-full h-7 flex items-center justify-center bg-white text-center">
                  Powered by @cc, all rights are reserved
                </div>
              </>
            ) : !photoUploaded ? (
              <>
                <img className="max-w-full max-h-64" src={Rofabs} alt="Rofabs" />
                <CgSpinner size={64} className="mt-1 animate-spin" />
                <p>Waiting for your picture upload to be completed</p>
              </>
            ) : (
              <>
                <ImagePopup
                  Uploadedimage={photoLink}
                  setShowModal={setShowModal}
                  showModal={showModal}
                />
              </>
            )}
          </main>
        )
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1>Where did you come from?</h1>
        </main>
      )}
    </div>
  );
};

export default QRCodeComponent;
