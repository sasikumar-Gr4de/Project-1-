import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const Login = () => {
  const { login: loginUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const email = formData.email;
      const password = formData.password; // Fixed: was using email for password
      const res = await loginUser(email, password);
      const { success, data } = res;
      setIsLoading(false);
      if (success) {
        const { email_verified } = data;
        if (email_verified) navigate("/dashboard");
        else navigate("/verify-email", { replace: true, state: { email } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0E] flex">
      {/* Form Section - Left Side */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-[500px]">
          {/* Logo */}
          <div className="flex justify-start mb-16">
            <img
              src={logo}
              alt="GR4DE Logo"
              className="h-[100px] w-[100px] object-contain"
            />
          </div>

          {/* Title */}
          <div className="mb-2">
            <h1 className="text-[22px] font-bold test-primary font-inter-tight">
              Log in
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-[18px] text-white font-inter-tight font-normal">
              Welcome Back! Please enter your details
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-4">
              <Label
                htmlFor="login-email"
                className="text-[16px] font-medium text-white font-inter-tight"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-[46px] bg-[#343434] border-none rounded-[5px] pl-4 text-white font-inter-tight font-normal placeholder:text-[#E1E5DD] placeholder:opacity-70 focus:ring-0"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <Label
                htmlFor="login-password"
                className="text-[16px] font-medium text-white font-inter-tight"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full h-[46px] bg-[#343434] border-none rounded-[5px] pl-4 pr-10 text-white font-inter-tight font-normal placeholder:text-[#E1E5DD] placeholder:opacity-70 focus:ring-0"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E1E5DD] hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forget-password">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-[#FF3838] hover:text-[#FF3838]/80 text-[16px] h-auto font-normal font-inter-tight"
                >
                  Forgot Password?
                </Button>
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-[46px] bg-primary hover:bg-primary/90 text-[#0F0F0E] font-inter-tight font-semibold text-[20px] rounded-[10px] transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#0F0F0E] border-t-transparent rounded-full animate-spin" />
                  <span>Log in...</span>
                </div>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-12 pt-8 border-t border-primary">
            <p className="text-center text-[18px] text-white font-inter-tight font-normal">
              Don't have an account?{" "}
              <Link to="/register">
                <Button
                  variant="link"
                  className="px-1 test-primary hover:test-primary/80 text-[18px] h-auto font-medium font-inter-tight underline"
                >
                  Sign up
                </Button>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Visual Section - Right Side */}
      <div className="flex-1 bg-[#343434] hidden lg:flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#9ae619]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              The Game Reads You Back
            </h2>
            <p className="text-lg xl:text-xl text-gray-300 leading-relaxed">
              GR4DE is a performance analytics platform that scores youth
              footballers based on match data, GPS tracking, and elite
              benchmarks
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 test-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-white">Performance Metrics</h3>
              <p className="text-sm text-gray-300">
                Track key performance indicators
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 test-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-white">Progress Tracking</h3>
              <p className="text-sm text-gray-300">
                Monitor development over time
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 test-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-white">Team Collaboration</h3>
              <p className="text-sm text-gray-300">
                Connect with coaches and players
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 test-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-white">Data Security</h3>
              <p className="text-sm text-gray-300">
                Enterprise-grade protection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
