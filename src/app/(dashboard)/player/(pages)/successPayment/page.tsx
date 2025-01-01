"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (sessionId) {
        try {
          const response = await axios.get(
            `http://localhost:8800/api/payment/payment-success?session_id=${sessionId}`
          );
          console.log(response.data);
          console.log(`All the data ${response}`);
          setMessage(response.data.message);
        } catch (error) {
          console.error("Error fetching payment status:", error);
          setMessage("Failed to confirm payment.");
        }
      }
    };

    fetchPaymentStatus();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Status</h1>
      <p style={{ color: "green", fontSize: "18px" }}>
      {message && <span>&#10003; </span>}
      {message}
      </p>
    </div>
  );
};

export default PaymentSuccess;
