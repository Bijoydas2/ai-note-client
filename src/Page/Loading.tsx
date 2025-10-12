import React from "react";
import { Loader2 } from "lucide-react";

type Props = {
  message?: string;
};

const Loading: React.FC<Props> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e1420] text-white">
      <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
      <p className="text-gray-300 text-lg">{message}</p>
    </div>
  );
};

export default Loading;
