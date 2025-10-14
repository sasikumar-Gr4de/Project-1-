import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Trophy,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    organization: "",
    phone_number: "",
    role: "client",
    client_type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength
    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
      });
    }
  };

  const checkPasswordMatch = () => {
    return (
      formData.password === formData.confirm_password &&
      formData.confirm_password.length > 0
    );
  };

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return "text-red-400";
    if (score <= 3) return "text-yellow-400";
    return "text-green-400";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPasswordMatch()) {
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  const roles = [
    { value: "client", label: "Client" },
    { value: "coach", label: "Coach" },
    { value: "scout", label: "Scout" },
    { value: "annotator", label: "Data Annotator" },
    { value: "data-reviewer", label: "Data Reviewer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Gr4de</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            Join Gr4de Analytics
          </h1>
          <p className="text-gray-400">
            Start your journey in professional football analytics
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-2xl border border-gray-700">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="text-sm font-medium text-gray-300"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-300"
                  >
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <label
                    htmlFor="organization"
                    className="text-sm font-medium text-gray-300"
                  >
                    Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Your club or company"
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone_number"
                    className="text-sm font-medium text-gray-300"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Client Type (if role is client) */}
                {formData.role === "client" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="client_type"
                      className="text-sm font-medium text-gray-300"
                    >
                      Client Type
                    </label>
                    <select
                      id="client_type"
                      name="client_type"
                      value={formData.client_type}
                      onChange={handleChange}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="club">Football Club</option>
                      <option value="academy">Youth Academy</option>
                      <option value="agency">Player Agency</option>
                      <option value="media">Media Company</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Password strength
                      </span>
                      <span
                        className={`text-xs font-medium ${getPasswordStrengthColor()}`}
                      >
                        {getPasswordStrengthScore()}/5
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { key: "length", text: "At least 8 characters" },
                        { key: "uppercase", text: "One uppercase letter" },
                        { key: "lowercase", text: "One lowercase letter" },
                        { key: "number", text: "One number" },
                        { key: "special", text: "One special character" },
                      ].map((req) => (
                        <div
                          key={req.key}
                          className="flex items-center space-x-2"
                        >
                          {passwordStrength[req.key] ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-500" />
                          )}
                          <span
                            className={`text-xs ${
                              passwordStrength[req.key]
                                ? "text-green-400"
                                : "text-gray-500"
                            }`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-medium text-gray-300"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                      formData.confirm_password && !checkPasswordMatch()
                        ? "border-red-500"
                        : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirm_password && !checkPasswordMatch() && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-300">
                  All data is encrypted and stored securely. We never share your
                  information with third parties.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200"
                disabled={
                  isLoading ||
                  !checkPasswordMatch() ||
                  getPasswordStrengthScore() < 3
                }
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Sign in to your account</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
          <p className="text-xs text-gray-500">
            © 2024 Gr4de Football Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
