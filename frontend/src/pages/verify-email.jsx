// src/pages/verify-email.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Mail,
  CheckCircle,
  Clock,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { user, checkEmailVerification, setNeedsEmailVerification } =
    useAuthStore();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const needsVerification = await checkEmailVerification();
      if (!needsVerification && user) {
        navigate("/dashboard");
      }
    };

    checkVerificationStatus();

    // Check every 5 seconds if email is verified
    const interval = setInterval(checkVerificationStatus, 5000);

    return () => clearInterval(interval);
  }, [checkEmailVerification, navigate, user]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user?.email,
      });

      if (error) {
        throw error;
      }

      setResendSuccess(true);
      setCountdown(60); // 60 seconds cooldown
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      console.error("Error resending email:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setNeedsEmailVerification(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Gr4de</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400">
            Almost there! Please verify your email to continue
          </p>
        </div>

        {/* Verification Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm shadow-2xl border border-gray-700">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-800">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Check your inbox
                </h3>
                <p className="text-gray-300">
                  We've sent a verification link to:
                </p>
                <p className="text-blue-400 font-medium text-lg">
                  {user?.email}
                </p>
                <p className="text-gray-400 text-sm">
                  Click the link in the email to verify your account and start
                  using Gr4de Analytics.
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-300">
                  Your account security is our priority
                </p>
              </div>

              {/* Resend Email Section */}
              <div className="space-y-4">
                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-400 text-sm mb-3">
                    Didn't receive the email?
                  </p>

                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending || countdown > 0}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition-all duration-200"
                  >
                    {isResending ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Resend Verification Email</span>
                      </div>
                    )}
                  </Button>

                  {resendSuccess && (
                    <div className="flex items-center justify-center space-x-2 mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">
                        Verification email sent!
                      </span>
                    </div>
                  )}
                </div>

                {/* Check Status Button */}
                <Button
                  onClick={() => checkEmailVerification()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Check Verification Status</span>
                  </div>
                </Button>

                {/* Sign Out Option */}
                <div className="text-center">
                  <button
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                  >
                    Not your email? Sign out
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white text-sm">Need help?</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <p>• Check your spam or junk folder</p>
                <p>• Ensure you entered the correct email address</p>
                <p>• Contact support if you continue having issues</p>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => window.open("mailto:support@gr4de.com")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-gray-500">
            © 2025 Gr4de Football Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
