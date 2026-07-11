import React, { useState } from "react";
import {
  Mail,
  Lock,
  School,
  Eye,
  EyeOff,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import banner from "../../assests/school-banner.png";
import { loginSchema } from "../../validations/login/loginSchema";
import { loginApi } from "../../api/auth/authApi";
import { useAuthStore } from "../../store/auth/authStore";

const Login = () => {
  const [dark, setDark] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      schoolCode: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await loginApi(formData);

      setAuth({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className={`h-screen overflow-hidden ${dark ? "bg-gray-950" : "bg-gray-100"}`}
    >
      <div className="grid lg:grid-cols-2 h-full">
        <div className="relative h-full overflow-auto custom-scrollbar">
          <img
            src={banner}
            className="absolute inset-0 w-full h-full object-cover"
            alt="School Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/70 via-black/60 to-black/80" />

          <div className="relative z-10 flex flex-col justify-center h-full p-10 lg:p-14">
            <span className="bg-cyan-600/30 border border-cyan-400 text-cyan-300 px-5 py-2 rounded-full w-fit text-sm font-semibold tracking-wider">
              SCHOOL ERP 2.0
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl mt-8 font-bold text-white leading-tight">
              Empowering
              <br />
              Smart Schools
            </h1>

            <p className="text-gray-300 mt-6 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed">
              Manage students, teachers, attendance, fees, examinations and
              transport with one powerful ERP platform.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-5 mt-10 lg:mt-14">
              <Card title="100+ Schools" value="Running" dark={dark} />
              <Card title="20K+" value="Students" dark={dark} />
              <Card title="99.9%" value="Uptime" dark={dark} />
              <Card title="24 x 7" value="Support" dark={dark} />
            </div>
          </div>
        </div>

        <div
          className={`overflow-auto custom-scrollbar ${dark ? "bg-gray-950" : "bg-white"}`}
        >
          <div className="max-w-md mx-auto py-8 px-6 md:py-10 md:px-8 min-h-full flex flex-col justify-center">
            <div className="flex justify-end mb-6 md:mb-8">
              <button
                type="button"
                onClick={() => setDark(!dark)}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  dark
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <h2
              className={`text-3xl md:text-4xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
            >
              Welcome Back
            </h2>

            <p className={`${dark ? "text-gray-400" : "text-gray-500"} mt-2`}>
              Enter your credentials to access your academic portal.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email"
                icon={<Mail size={18} />}
                placeholder="name@example.com"
                dark={dark}
                type="email"
                error={errors.email?.message}
                register={register("email")}
              />

              <div className="mt-5">
                <label className={dark ? "text-gray-400" : "text-gray-600"}>
                  Password
                </label>

                <div
                  className={`mt-2 flex items-center rounded-xl px-4 transition-all duration-200 ${
                    dark
                      ? "bg-gray-800 border border-gray-700 focus-within:border-cyan-500"
                      : "bg-gray-50 border border-gray-300 focus-within:border-cyan-500"
                  }`}
                >
                  <Lock
                    size={18}
                    className={dark ? "text-gray-400" : "text-gray-500"}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    {...register("password")}
                    className={`autofill-input flex-1 bg-transparent px-3 py-4 outline-none ${
                      dark
                        ? "text-white dark-autofill"
                        : "text-gray-900 light-autofill"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={dark ? "text-gray-400" : "text-gray-500"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Input
                label="School Code"
                icon={<School size={18} />}
                placeholder="SCH-XXXX"
                dark={dark}
                type="text"
                error={errors.schoolCode?.message}
                register={register("schoolCode")}
              />

              <div className="flex justify-between items-center mt-5">
                <label
                  className={`flex gap-2 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="accent-cyan-600 w-4 h-4 rounded"
                  />
                  Remember Me
                </label>

                <button
                  type="button"
                  className="text-cyan-500 hover:text-cyan-400 text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full transition rounded-xl py-4 text-white font-semibold flex justify-center items-center gap-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight size={20} />
              </button>
            </form>

            <p
              className={`text-center ${dark ? "text-gray-400" : "text-gray-500"} mt-6 text-sm`}
            >
              New user?{" "}
              <span className="text-cyan-500 hover:text-cyan-400 font-medium cursor-pointer">
                Sign up
              </span>{" "}
              to manage your school activities seamlessly!
            </p>

            <p
              className={`text-center text-xs ${dark ? "text-gray-600" : "text-gray-400"} mt-8`}
            >
              © 2026 School ERP · Empowering the next generation of leaders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, dark }) => (
  <div
    className={`rounded-2xl p-4 md:p-5 transition-all duration-200 ${
      dark
        ? "bg-white/10 border border-white/20 backdrop-blur-lg"
        : "bg-white/30 border border-white/40 backdrop-blur-md shadow-md"
    }`}
  >
    <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-bold">
      {title}
    </h3>
    <p className="text-cyan-200 text-sm md:text-base mt-1">{value}</p>
  </div>
);

const Input = ({
  label,
  icon,
  placeholder,
  dark,
  type = "text",
  register,
  error,
}) => (
  <div className="mt-5">
    <label className={dark ? "text-gray-400" : "text-gray-600"}>{label}</label>

    <div
      className={`mt-2 flex items-center rounded-xl px-4 transition-all duration-200 ${
        dark
          ? "bg-gray-800 border border-gray-700 focus-within:border-cyan-500"
          : "bg-gray-50 border border-gray-300 focus-within:border-cyan-500"
      }`}
    >
      <span className={dark ? "text-gray-400" : "text-gray-500"}>{icon}</span>

      <input
        type={type}
        placeholder={placeholder}
        autoComplete={type === "email" ? "email" : "off"}
        {...register}
        className={`autofill-input flex-1 bg-transparent px-3 py-4 outline-none ${
          dark ? "text-white dark-autofill" : "text-gray-900 light-autofill"
        }`}
      />
    </div>

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Login;
