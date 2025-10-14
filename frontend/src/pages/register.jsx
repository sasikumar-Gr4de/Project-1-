import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
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
import { useAuthStore } from "@/store/authStore";

const Register = () => {
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
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      organization: "",
      phone_number: "",
      role: "client",
      client_type: "",
    },
  });

  const { watch, setValue } = form;
  const formData = watch();

  const handlePasswordChange = (value) => {
    setPasswordStrength({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    });
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

  const onSubmit = async (data) => {
    if (!checkPasswordMatch()) {
      return;
    }
    const response = await registerUser(data);
    if (response.success) {
      // window.alert("Registration successful! You can now log in.");
      navigate("/dashboard");
    }
    setIsLoading(true);
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
        <Card className="bg-gray-800/50 backdrop-blur-sm shadow-2xl border border-gray-700">
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Full Name *
                        </FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                              required
                              autoComplete="name"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Email Address *
                        </FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                              required
                              autoComplete="email"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Role *
                        </FormLabel>
                        <div className="relative">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border border-gray-600 text-white">
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Organization */}
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Organization
                        </FormLabel>
                        <div className="relative">
                          <Building className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your club or company"
                              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Phone Number
                        </FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Client Type (if role is client) */}
                  {formData.role === "client" && (
                    <FormField
                      control={form.control}
                      name="client_type"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-300">
                            Client Type
                          </FormLabel>
                          <div className="relative">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-800 border border-gray-600 text-white">
                                <SelectItem value="club">
                                  Football Club
                                </SelectItem>
                                <SelectItem value="academy">
                                  Youth Academy
                                </SelectItem>
                                <SelectItem value="agency">
                                  Player Agency
                                </SelectItem>
                                <SelectItem value="media">
                                  Media Company
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Password *
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                            autoComplete="new-password"
                            data-bs-toggle=""
                            data-bs-placement=""
                            onChange={(e) => {
                              field.onChange(e);
                              handlePasswordChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-gray-400 hover:text-gray-300 transition-colors"
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
                              {
                                key: "uppercase",
                                text: "One uppercase letter",
                              },
                              {
                                key: "lowercase",
                                text: "One lowercase letter",
                              },
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Confirm Password *
                      </FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className={`pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                              formData.confirm_password && !checkPasswordMatch()
                                ? "border-red-500"
                                : ""
                            }`}
                            required
                            autoComplete="new-password"
                            data-bs-toggle=""
                            data-bs-placement=""
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirm_password && !checkPasswordMatch() && (
                        <p className="text-xs text-red-400">
                          Passwords do not match
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Security Notice */}
                <div className="flex items-center space-x-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-xs text-blue-300">
                    All data is encrypted and stored securely. We never share
                    your information with third parties.
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
            </Form>
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
            © 2025 Gr4de Football Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
