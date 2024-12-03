import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CircleMinus, CirclePlus, } from "lucide-react";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import { db, auth } from "../Views/FireBase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Frame from "../Views/images/Frame 427319688.png";
import { API_URL } from "../secrets";

const ImagePopup = ({ capturedImage, setShowModal, showModal, Uploadedimage }) => {
  const [numCopies, setNumCopies] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [continuePaymentLoading, setContinuePaymentLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        navigate("/PrintSuccess");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  const handleIncrease = () => setNumCopies(numCopies + 1);
  const handleDecrease = () => numCopies > 1 && setNumCopies(numCopies - 1);

  const handleBackButton = () => {
    navigate("/Home");
  };

  const handlePayment = async () => {
    try {
      setContinuePaymentLoading(true);
      setPaymentStatus(null);
      console.log("Making payment request to backend...");
      const response = await axios.post(`${API_URL}/payment`, {
        numCopies,
      });
      const data = response.data;

      console.log("INFO: ", data.amount, data.currency, data.orderId);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Vijetha Photo Booth",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.orderId,
        method: {
          qr: true,
        },
        handler: async (response) => {
          console.log("Handling Razorpay response:", response);

          if (response.razorpay_payment_id) {
            setPaymentStatus("success");
            const user = auth.currentUser;
            if (user) {
              const orderData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: data.amount,
                currency: data.currency,
                numCopies,
                timestamp: new Date().getTime(),
                status: "success",
              };

              console.log("Saving order data to Firebase:", orderData);

              const orderRef = doc(db, "users", user.uid, "orders", response.razorpay_payment_id);
              await setDoc(orderRef, orderData);
              console.log("Order saved in Firebase");

              // Show the success modal
              setShowSuccessModal(true);
            } else {
              console.log("User is not authenticated");
            }
          } else {
            setPaymentStatus("failure");
            console.log("Payment failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      console.log("Initializing Razorpay with options:", options);
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Error in handlePayment:", err);
      setPaymentStatus("failure");
    } finally {
      setContinuePaymentLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative max-w-[600px] w-[90vw] h-[60vh] bg-white rounded-lg p-4 flex flex-col items-center border-4 border-[#F5E3ED]">
          <button
            onClick={handleBackButton}
            className="absolute left-[5%] z-50 rounded-full h-[6vh] w-[3rem] bg-lavenderblush"
          >
            <ArrowLeft />
          </button>
          <h3 className="mt-[-3%] mb-4 text-[1.5vw] font-bold font-sans">Print Photo</h3>
          <div className="relative flex flex-col items-center justify-center w-[75%] h-[85%] bg-[#fbfbfb] rounded-lg border-4 border-whitesmoke">
            <img
              className="absolute top-[3%] w-[70%] h-[70%] mt-1 object-cover"
              alt="Example photo booth output"
              src={capturedImage || Uploadedimage}
            />
            <div className="absolute bottom-1 w-[90%] h-[15%] bg-white p-2 rounded-lg flex items-center justify-between">
              <div className="flex flex-col leading-6">
                <p className="font-sans font-bold text-base">Select number of copies</p>
                <p className="font-sans text-sm">Each copy costs ₹10</p>
              </div>
              <div className="flex items-center">
                <button
                  className="flex items-center justify-center bg-[#D672AC] text-white rounded-sm w-8 h-8 mx-2"
                  onClick={handleDecrease}
                >
                  <CircleMinus />
                </button>
                <span>{numCopies}</span>
                <button
                  className="flex items-center justify-center bg-[#D672AC] text-white rounded-sm w-8 h-8 mx-2"
                  onClick={handleIncrease}
                >
                  <CirclePlus />
                </button>
              </div>
            </div>
          </div>
          {paymentStatus === "failure" && (
            <p className="mt-2 text-red-500">Payment failed. Please try again.</p>
          )}
          <button
            onClick={handlePayment}
            className="mt-2 flex justify-end items-center w-[78%] h-[10%] bg-[#D672AC] text-white rounded-lg px-4 py-2 text-base font-sans font-normal relative"
          >
            <span className="absolute left-[8%] top-[15%] text-[0.6vw] text-[#EEEEEE] font-sans">
              Total
            </span>
            <span className="absolute left-[8%] top-[40%] text-[0.9vw] font-sans">
              ₹{numCopies * 10}
            </span>
            {
              continuePaymentLoading ? (
                <CgSpinner />

              ) : (
                <>Continue payment <ArrowRight className="ml-4" /></>
              )
            }
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative max-w-[600px] w-[90vw] h-[60vh] bg-white rounded-[8px] p-4 flex flex-col items-center border-4 border-[#F5E3ED]">
            <h3 className="text-[1.2vw] mr-[60%] font-bold font-opensans mb-0">Payment Success!</h3>
            <h4 className="text-[1.2vw] mr-[60%]">{numCopies} copies, Total ₹{numCopies * 10} </h4>
            <img
              className="w-[40%] h-[60%] mt-[15%] object-cover"
              alt="Payment success image"
              src={Frame}
            />
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute left-[5%] z-50 rounded-full h-[6vh] w-[3rem] bg-lavenderblush"
            >
              <ArrowLeft />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePopup;
