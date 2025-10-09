// src/components/ErrorPage.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
  message?: string;
};

const ErrorPage: React.FC<Props> = ({ message = "Oops! Something went wrong." }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e1420] text-white px-4">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Error</h1>
      <p className="text-gray-300 mb-6 text-center">{message}</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
