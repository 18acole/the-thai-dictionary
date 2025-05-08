import { useState } from 'react';

export default function TestPage() {
  // A minimal page to test if Tailwind CSS is working
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
        <div className="p-8">
          <div className="uppercase tracking-wide text-purple-700 font-semibold">
            Tailwind CSS Test
          </div>
          <h1 className="text-3xl font-bold text-pink-600 mt-2">
            The Thai Dictionary 🇹🇭
          </h1>
          <p className="mt-2 text-gray-500">
            This is a test page to verify that Tailwind CSS is working properly.
          </p>
          <button className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}