"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IDKitWidget, type ISuccessResult, VerificationLevel } from "@worldcoin/idkit";

const Worldcoin = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState("");

  const onSuccess = () => {
    setVerificationStatus("Verification successful! Redirecting...");
    setTimeout(() => {
      router.push("/aiagent");
    }, 2000);
  };

  const handleProof = async (result: ISuccessResult) => {
    try {
      console.log("Proof received from IDKit, sending to backend:", result);
      const requestBody = {
        proof: {
          nullifier_hash: result.nullifier_hash,
          merkle_root: result.merkle_root,
          proof: result.proof,
          verification_level: "device" as const
        }
      };

      console.log("Sending structured request to backend:", requestBody);
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        console.log("Verification successful!");
        setVerificationStatus("Verification successful! Redirecting...");
        setTimeout(() => {
          router.push("/aiagent");
        }, 2000);
      } else {
        console.error("Verification failed with details:", data);
        setVerificationStatus(`Verification failed: ${data.detail || 'Unknown error'}`);
        throw new Error(data.detail || "Verification failed");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setVerificationStatus(error instanceof Error ? error.message : "Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Identity Verification</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
          {/* Human Verification Box */}
          <div className="bg-white rounded-xl p-8 w-full md:w-1/2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Human Verification</h2>
            <p className="mb-4 text-center text-gray-600">
              Complete a quick verification to access our AI Agent. This ensures a secure environment for all users and helps us provide personalized assistance.
            </p>
            {verificationStatus && (
              <div className={`p-3 rounded-md mb-4 ${
                verificationStatus.includes("successful") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p className="text-center font-medium">{verificationStatus}</p>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
                action={process.env.NEXT_PUBLIC_ACTION_ID as string}
                onSuccess={onSuccess}
                handleVerify={handleProof}
                verification_level={VerificationLevel.Device}
              >
                {({ open }) => (
                  <button
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                    onClick={open}
                  >
                    Verify with World ID
                  </button>
                )}
              </IDKitWidget>
            </div>
          </div>

         
         
        </div>
        
       
      </div>
    </div>
  );
};

export default Worldcoin;