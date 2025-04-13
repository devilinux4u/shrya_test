import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const status = searchParams.get("status");
      const pidx = searchParams.get("pidx");
      const amount = searchParams.get("total_amount");

      if (status === "Completed" && pidx) {
        try {
          // You should have a backend route that verifies the pidx with Khalti
          const response = await axios.post("http://localhost:3000/api/verify-khalti", {
            pidx, amount
          });

          console.log("Verification response:", response.data);

          if (response.data?.status === "Completed") {
            toast.success("Payment successful!");
            navigate("/UserBookings");
          } else {
            setStatusMessage("Payment verification failed.");
            toast.error("Payment verification failed.");
          }
        } catch (err) {
          console.error("Verification error:", err);
          setStatusMessage("An error occurred while verifying payment.");
          toast.error("Error verifying payment.");
        }
      } else if (status === "User canceled") {
        setStatusMessage("Payment was canceled by the user.");
        toast.info("Payment canceled.");
      } else {
        setStatusMessage("Invalid payment attempt.");
        toast.error("Invalid payment details.");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{statusMessage}</h2>
        <p>You will be redirected shortly if payment was successful.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
