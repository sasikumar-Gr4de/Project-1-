// VerifyEmail.jsx
import { useState, useEffect } from "react";
import { Mail, ArrowLeft, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("user@example.com"); // This would come from your auth context

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCountdown(60);
    setIsResending(false);
    // Here you would call your resend verification email API
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Form Section - Always visible */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-[360px] sm:max-w-[400px] mx-auto">
          {/* Back to Login */}
          {/* <div className="mb-4 sm:mb-6">
            <Link to="/login">
              <Button
                variant="ghost"
                className="pl-0 text-muted-foreground hover:text-foreground text-sm h-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div> */}

          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="GR4DE Logo"
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
            />
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="space-y-2 pb-4 px-4 sm:px-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl text-center font-semibold">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 pb-6">
              {/* Email Display */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {email}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Check your inbox
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Look for an email from GR4DE with the subject "Verify Your
                      Email Address"
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click the verification link
                    </p>
                    <p className="text-xs text-muted-foreground">
                      The link will expire in 24 hours for security reasons
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Complete your registration
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Once verified, you'll be redirected to complete your
                      profile setup
                    </p>
                  </div>
                </div>
              </div>

              {/* Resend Email Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Didn't receive the email?
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={countdown > 0 || isResending}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all duration-200"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>
                </div>

                {/* Countdown Progress */}
                {countdown > 0 && (
                  <div className="space-y-2">
                    <Progress
                      value={((60 - countdown) / 60) * 100}
                      className="h-1"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Wait before requesting a new code
                    </p>
                  </div>
                )}
              </div>

              {/* Support Link */}
              {/* <div className="mt-6 pt-4 border-t border-border">
                <p className="text-center text-xs text-muted-foreground">
                  Having trouble?{" "}
                  <Button
                    variant="link"
                    className="px-1 text-primary hover:text-primary/80 text-xs h-auto font-medium"
                  >
                    Contact Support
                  </Button>
                </p>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual Section - Hidden on mobile */}
      <div className="flex-1 bg-linear-to-br from-primary/15 to-secondary/15 hidden lg:flex items-center justify-center p-8 xl:p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight">
              Almost There!
            </h2>
            <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
              Verify your email to unlock the full potential of GR4DE's
              performance analytics platform
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
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
              <h3 className="font-semibold text-foreground text-sm">
                Secure Account
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protect your data with verified access
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Instant Access
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get started immediately after verification
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
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
              <h3 className="font-semibold text-foreground text-sm">
                Team Features
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with coaches and team members
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-primary"
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
              <h3 className="font-semibold text-foreground text-sm">
                Full Analytics
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Access comprehensive performance data
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-8">
            <p className="text-sm text-foreground">
              <strong>Pro Tip:</strong> Check your spam folder if you don't see
              the email within a few minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
