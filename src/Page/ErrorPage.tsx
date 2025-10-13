import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
  message?: string;
  code?: number;
};

const ErrorPage: React.FC<Props> = ({ message, code }) => {
  const navigate = useNavigate();

 
  const defaultMessages: Record<number, string> = {
    404: "Page Not Found",
    500: "Oops! Something went wrong.",
  };

  const displayMessage = message || (code ? defaultMessages[code] : "Oops! Something went wrong.");
  const displayTitle = code ? code : "Error";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e1420] text-white px-4">
      <title>Error Page</title>
      <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl sm:text-6xl font-bold mb-2">{displayTitle}</h1>
      <p className="text-gray-300 mb-6 text-center">{displayMessage}</p>
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
