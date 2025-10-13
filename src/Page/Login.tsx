import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn, User, Brain } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const location=useLocation();
  const { register, handleSubmit } = useForm<FormData>();
  const { loginUser, googleLogin } = useContext(AuthContext);
  const from=location.state || "/dashboard";
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.email, data.password);
      toast.success("Login successful!");
      navigate(from);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Google login successful!");
      navigate(from);
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1724] px-4">
      <title>Login</title>
      <div className="w-full max-w-md bg-[#101b29] rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 gap-2">
          <div className="bg-[#0b3b7a] p-2 rounded-md">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Notes</h2>
        </div>

        <h3 className="text-xl font-semibold text-center text-white mb-6">
          Welcome Back 
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: true })}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#0b1520] text-white border border-[#16202a] focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#0b1520] text-white border border-[#16202a] focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#0b3b7a] hover:bg-[#0a3365] text-white rounded-md font-semibold transition"
          >
            <LogIn className="w-5 h-5" /> Login
          </button>
        </form>

        
        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-600" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition text-gray-200"
        >
          <User className="w-5 h-5" /> Continue with Google
        </button>

        {/* Register Link */}
        <p className="text-gray-400 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
