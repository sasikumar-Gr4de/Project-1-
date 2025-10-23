import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Target,
  BarChart3,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Form Section - Always visible */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-[360px] sm:max-w-[400px] mx-auto">
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
              <CardTitle className="text-xl sm:text-2xl text-center font-semibold">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11 bg-input/50 border-border focus:ring-2 focus:ring-primary/20"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 bg-input/50 border-border focus:ring-2 focus:ring-primary/20"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="login-remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="login-remember"
                      className="text-sm text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="px-0 text-primary hover:text-primary/80 text-sm h-auto font-medium"
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all duration-200"
                >
                  Sign In
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <Button
                      variant="link"
                      className="px-1 text-primary hover:text-primary/80 text-sm h-auto font-medium"
                    >
                      Sign up
                    </Button>
                  </Link>
                </p>
              </div>
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
              The Game Reads You Back
            </h2>
            <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
              GR4DE is a performance analytics platform that scores youth
              footballers based on match data, GPS tracking, and elite
              benchmarks
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Smart Adaptation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Games that learn from your decisions
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Real-time Analytics
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your performance metrics
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Community Driven
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with like-minded gamers
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Secure Platform
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is always protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
