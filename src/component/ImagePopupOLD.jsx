import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CircleMinus, CirclePlus } from "lucide-react";


const Imagepopup2 = ({ capturedImage, setShowModal, showModal }) => {

  const [numCopies, setNumCopies] = useState(1);
  const [initPaymentLoading, setInitPaymentLoading] = useState(false);

  const handleIncrease = () => {
    setNumCopies(numCopies + 1);
  };

  const handleDecrease = () => {
    if (numCopies > 1) {
      setNumCopies(numCopies - 1);
    }
  };

  const handlebackbutton = () => {
    setShowModal(false);
  }

  const handlePayment = async () => {
    setShowModal(false);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      >

        <div
          style={{
            height: "60vh",
            position: "relative",
            width: "90vw",
            maxWidth: "600px",
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "0.25rem solid lavenderblush",
          }}
        >
          <button onClick={handlebackbutton} style={{
            width: "3rem",
            zIndex: "999",
            left: "5%",
            borderRadius: "50%",
            height: "6vh",
            position: "absolute",
          }}><ArrowLeft /></button>
          <h3
            style={{
              marginTop: "-3%",
              fontSize: "1.5vw",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "open sans",
            }}
          >
            Print Photo
          </h3>

          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "75%",
              height: "85%",
              backgroundColor: "#fbfbfb",
              borderRadius: "1rem",
              border: "0.25rem solid whitesmoke",
            }}
          >
            <img
              style={{
                position: "absolute",
                top: "3%",
                width: "70%",
                height: "70%",
                marginTop: "0.25rem",
                objectFit: "cover",
              }}
              alt="Example photo booth output"
              src={capturedImage}
            />

            <div
              style={{
                height: "15%",
                position: "absolute",
                bottom: "0.25rem",
                width: "90%",
                backgroundColor: "white",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.5",
                }}
              >
                <p
                  style={{
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Select number of copies
                </p>
                <p
                  style={{
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "0.8rem",
                  }}
                >
                  Each copy costs ₹10
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#D672AC",
                    padding: "0.25rem",
                    color: "white",
                    borderRadius: "0.25rem",
                    width: "2rem",
                    height: "2rem",
                    marginRight: "0.5rem",
                  }}
                  onClick={handleDecrease}
                >
                  <CircleMinus />
                </button>
                <span>{numCopies}</span>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#D672AC",
                    padding: "0.25rem",
                    color: "white",
                    borderRadius: "0.25rem",
                    width: "2rem",
                    height: "2rem",
                    marginLeft: "0.5rem",
                  }}
                  onClick={handleIncrease}
                >
                  <CirclePlus />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "78%",
              height: "10%",
              marginTop: "0.625rem",
              backgroundColor: "#D672AC",
              color: "white",
              borderRadius: "0.5rem",
              padding: "0.5rem 0.5rem",
              fontSize: "1rem",
              fontFamily: "open sans",
              fontWeight: "400",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "8%",
                top: "15%",
                fontFamily: "open sans",
                fontSize: "0.6vw",
                color: "#EEEEEE",
              }}
            >
              Total
            </span>

            <span
              style={{
                position: "absolute",
                left: "8%",
                top: "40%",
                fontFamily: "open sans",
                fontSize: "0.9vw",
              }}
            >
              ₹{numCopies * 10}
            </span>
            Continue payment   <ArrowRight style={{ marginLeft: "4%" }} />
          </button>
        </div>
      </div>
      <style jsx>{`
    
 /* Styles for small screens */
@media (max-width: 600px) {
  h3 {
    font-size: 1.2rem !important;
  }

  div[style*="width: 90vw"] {
    width: 95vw !important;
  }

  div[style*="height: 60vh"] {
    height: 80vh !important;
  }

  button {
    font-size: 0.8rem !important;
    height: auto !important;
    padding: 0.5rem !important;
  }

  span[style*="fontSize: 0.9vw"] {
    font-size: 0.9rem !important;
  }

  span[style*="fontSize: 0.6vw"] {
    font-size: 0.6rem !important;
  }

  img[style*="backgroundImage"] {
    background-image: none !important;
  }

  div[style*="flexDirection: column"] {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  div[style*="flexDirection: column"] > div {
    width: 100% !important;
  }

  div[style*="flexDirection: column"] > div > p {
    margin: 0.25rem 0 !important;
  }

  div[style*="justifyContent: flex-end"] {
    justify-content: center !important;
    width: 100% !important;
  }

  div[style*="justifyContent: space-between"] {
    justify-content: center !important;
    flex-direction: column !important;
    align-items: center !important;
  }
}

/* Styles for medium screens */
@media (min-width: 601px) and (max-width: 992px) {
  h3 {
    font-size: 1.4rem !important;
  }

  div[style*="width: 90vw"] {
    width: 80vw !important;
  }

  div[style*="height: 60vh"] {
    height: 70vh !important;
  }

  button {
    font-size: 0.9rem !important;
  }

  span[style*="fontSize: 0.9vw"] {
    font-size: 0.8rem !important;
  }

  span[style*="fontSize: 0.6vw"] {
    font-size: 0.7rem !important;
  }
}

/* Styles for large screens */
@media (min-width: 993px) {
  /* No specific styles for large screens */
}
    
    `}</style>
    </>
  );
};

export default Imagepopup2;