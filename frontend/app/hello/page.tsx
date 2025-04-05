"use client";

import React from 'react';

export default function HelloPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Verification Successful! 🎉
        </h1>
        <p className="text-gray-700 text-center mb-4">
          You have successfully verified your identity with World ID.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center">
          Welcome to the application!
        </div>
      </div>
    </div>
  );
} 