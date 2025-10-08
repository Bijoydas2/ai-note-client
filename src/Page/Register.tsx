import React, { useContext, useState } from "react";
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Brain,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router";
import {  toast } from "react-toastify";


type FormData = {
  name: string;
  email: string;
  password: string;
  image: FileList;
};

export const RegisterPage: React.FC = () => {
  const { signup, googleLogin } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await signup(data.email, data.password);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await googleLogin();
      toast.success("Google account connected!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      toast.error(err.message || "Google registration failed");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1724] px-4">
     
      <div className="w-full max-w-md bg-[#101b29] rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 gap-2">
          <div className="bg-[#0b3b7a] p-2 rounded-md">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Notes</h2>
        </div>

        <h3 className="text-xl font-semibold text-center text-white mb-6">
          Create Account ✨
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-gray-400 text-sm mt-1">Upload profile image</span>
          </div>

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#0b1520] text-white border border-[#16202a] focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#0b1520] text-white border border-[#16202a] focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
                  message:
                    "Include uppercase, lowercase, number & special character",
                },
              })}
              className="w-full pl-10 pr-10 py-2 rounded-md bg-[#0b1520] text-white border border-[#16202a] focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#0b3b7a] hover:bg-[#0a3365] text-white rounded-md font-semibold transition"
          >
            <UserPlus className="w-5 h-5" /> Register
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-600" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Google Register */}
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition text-gray-200"
        >
          <User className="w-5 h-5" /> Continue with Google
        </button>

        {/* Login Link */}
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
