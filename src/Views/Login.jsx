import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { auth } from "./FireBase/Firebase";
import background from "../Views/images/backgroundImg.png";
import PhoneRounded from "../Views/images/PhoneRounded.png";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const recaptchaContainerRef = React.createRef();
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    const initializeRecaptcha = () => {
      const recaptchaContainer = recaptchaContainerRef.current;
      if (recaptchaContainer) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          recaptchaContainer,
          {
            size: "invisible",
            callback: () => {},
            "expired-callback": () => {
              window.recaptchaVerifier.recaptcha.reset();
            },
            "error-callback": () => {
              window.recaptchaVerifier.recaptcha.reset();
            },
          }
        );
        setRecaptchaVerifier(window.recaptchaVerifier);
      }
    };

    initializeRecaptcha();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(countdown - 1), 1000);
    } else {
      setShowOtpInput(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (phoneNumber.length < 10) {
        toast.error("Please enter 10 digit phone number");
        return;
      }

      const formattedPhoneNumber = `+91${phoneNumber}`;
      console.log("Formatted Phone Number:", formattedPhoneNumber); // Debug
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );
      setCountdown(60);
      setShowOtpInput(true);
      window.confirmationResult = confirmationResult;
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      const otpString = otp.join("");
      if (otpString.length < 6) {
        toast.error("Please enter valid 6 digit OTP");
        return;
      }
      await window.confirmationResult.confirm(otpString);

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (id) {
        navigate(`/redirect?id=${id}`);
        toast.error("Please Upload Your Photo");
      } else {
        navigate("/Home");
        toast.error("Welcome To Photo Booth");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
      toast.error("Oops, Wrong OTP!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
      }}
      className="relative flex flex-col w-full h-screen bg-cover bg-center"
    >
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        <div className="w-full max-w-md h-auto rounded-xl bg-white box-border flex flex-col items-center justify-center py-8 px-4 gap-4 border-4 border-solid border-[#F5E3ED]">
          <h1 className="text-center leading-normal text-[#1B1B1B] font-semibold text-3xl ">
            Welcome to Photo Booth
          </h1>
          <h3 className="text-center leading-normal text-[#6C6C6C] font-semibold text-lg">
            Capture and customize your moments with ease.
          </h3>
          {showOtpInput ? (
            <>
              <div className="rounded-lg w-full bg-[#fbfbfb] flex flex-col items-center justify-between p-4 text-sm text-default border border-solid border-whitesmoke-100">
                <div className="relative h-20 w-full mb-6 flex items-center justify-center text-[#6C6C6C] font-semibold">
                  {showOtpInput
                    ? "Enter the OTP sent to your mobile"
                    : "Please enter your mobile number to receive a verification code"}
                </div>

                <div className="rounded-lg w-full mb-6 bg-white box-border h-12 overflow-hidden flex flex-row items-center justify-center text-lg text-gainsboro border border-solid border-gray-200">
                  <img
                    className="w-6 h-6 ml-2"
                    src={PhoneRounded}
                  />
                  <input
                    type="text"
                    id="phoneNumber"
                    value={`+91${phoneNumber}`}
                    readOnly
                    className="outline-none rounded-lg bg-white w-full h-full overflow-hidden items-center justify-start py-0 px-4 text-lg text-gainsboro"
                  />
                </div>
                <label className="relative h-20 w-full mb-6 flex items-center justify-center text-[#6C6C6C] font-semibold">
                  Enter your verification code
                </label>
                <div className="flex gap-2">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      id={`otp-input-${index}`}
                      value={value}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength={1}
                      pattern="\d*"
                      className="w-10 h-10 text-center font-bold text-sm border border-gray-400 rounded"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={verifyOTP}
                className="flex gap-1 items-center justify-center py-2.5 rounded-lg w-full h-14 bg-[#D672AC] text-lg text-white leading-[150%]"
                disabled={isLoading}
              >
                {isLoading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="rounded-lg bg-[#FBFBFB] gap-8 flex flex-col justify-between p-4 text-sm text-default border border-solid border-whitesmoke-100">
                <div className="relative text-[#6C6C6C] font-semibold">
                  {showOtpInput
                    ? "Enter the OTP sent to your mobile"
                    : "Please enter your mobile number to receive a verification code"}
                </div>
                <div className="rounded-lg bg-white box-border h-12 overflow-hidden flex flex-row items-center justify-start text-lg text-gainsboro border border-solid border-gray-200">
                  <img
                    className="w-6 h-6 ml-2"
                    src={PhoneRounded}
                  />
                  <div className="w-full overflow-hidden flex flex-col items-start justify-center">
                    <input
                      className="outline-none rounded-lg bg-white w-full h-full overflow-hidden items-center justify-start py-0 px-4 text-lg text-gainsboro"
                      type="tel"
                      placeholder="Mobile number "
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={sendOTP}
                className="flex gap-1 items-center justify-center py-2.5 rounded-lg w-full h-14 bg-[#D672AC] text-lg text-white leading-[150%]"
                disabled={isLoading || countdown > 0}
              >
                {isLoading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>
                  {countdown > 0
                    ? `Resend OTP in ${countdown} seconds`
                    : "Send code via SMS"}
                </span>
              </button>
            </>
          )}
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        </div>
      </main>
    </section>
  );
};

export default Login;
