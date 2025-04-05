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
      router.push("/hello");
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
          router.push("/hello");
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
    <div>
      <div className="min-h-[60vh] flex flex-row items-center justify-center bg-gray-100 space-x-6">
        {/* Human Verification Box */}
        <div className="bg-white text-black shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Human Verification</h1>
          <p className="mb-2 text-center">
            Please confirm your identity by verifying that you are a human. This step helps us prevent automated access
            and maintain security.
          </p>
          {verificationStatus && (
            <p className={`text-center mb-4 ${verificationStatus.includes("successful") ? "text-green-600" : "text-red-600"} font-semibold`}>
              {verificationStatus}
            </p>
          )}
          <div className="flex justify-center mt-6">
            <IDKitWidget
              app_id="app_f0ef697d1647ae52695abb0c2ca3407c"
              action="test-app"
              onSuccess={onSuccess}
              handleVerify={handleProof}
              verification_level={VerificationLevel.Device}
            >
              {({ open }) => (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={open}
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget>
          </div>
        </div>

        {/* Worldcoin Verification Box */}
        <div className="bg-white text-black shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Worldcoin Verification</h1>
          <p className="mb-2 text-center">
            Verify your identity using the Worldcoin simulator. This innovative tool ensures the authenticity of user
            identities through advanced verification methods.
          </p>
          <p className="mb-6 text-center">
            Access the simulator here:
            <span className="text-orange-600 font-semibold ml-1">
              <Link href="https://simulator.worldcoin.org">Worldcoin Simulator</Link>
            </span>
          </p>
        </div>
      </div>
      <div className="bg-gray-100 text-black">
        <div className="flex px-8 mx-7 flex-col items-center w-[90vw]">
          <b className="text-left">Note:</b>
          <p>
            You can either scan the QR code from a simulator or click on the QR code to copy it.
            Then select "paste code" option in simulator and paste the code. Choose "verify with orb"
            and wait until verification is done.
          </p>
          <p>
            <b>Make sure the identity is orb and device verified</b>
          </p>
          <p>
            For the time being If you are not able to verify it, just move to the Flash Loan contract deploy page by
            clicking{" "}
            <Link href="/arbitrage/base-tenderly" className="text-orange-500">
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Worldcoin;