import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-16 h-16 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;

  