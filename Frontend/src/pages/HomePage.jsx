import React from "react";
import UrlForm from "../components/UrlForm";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">URL Shortener</h2>
        <UrlForm />
      </div>
    </div>
  );
};

export default HomePage;
