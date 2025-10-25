import React, { FC } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const Loader: FC = () => {
    return (
        <div className="bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center h-screen"
            style={{
              
             
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                backgroundBlendMode: "overlay",
            }} >

            <div className="relative w-50 h-50 flex items-center justify-center">
                {/* Static Border */}
                <div className="absolute inset-0 rounded-full border-8 border-blue-600 "></div>

                {/* Rotating Border */}
                <motion.div
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{
                        borderTopColor: "#A855F7 ",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Logo */}
                <div className="w-50 h-50 bg-[#0b1220] rounded-full flex items-center justify-center shadow-lg">
                    <div className="p-8 bg-blue-600 rounded-full">
                            <Brain className="h-20 w-20 text-white" />
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;