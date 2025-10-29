import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' or 'verify'
  const [isLoading, setIsLoading] = useState(false);

  const { sendOtp, login } = useAuthStore();

  const handleSendOtp = async () => {
    if (!email && !phone) return;

    setIsLoading(true);
    try {
      await sendOtp(email || undefined, phone || undefined);
      setStep("verify");
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;

    setIsLoading(true);
    try {
      await login(email, phone, otp, {});
      // Redirect will happen automatically due to state change
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("input");
    setOtp("");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to GR4DE</CardTitle>
        <CardDescription>
          Sign in to access your player dashboard and reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            {step === "input" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={!email || isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-11 text-center text-lg font-mono"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    We sent a 6-digit code to {email}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={!otp || otp.length !== 6 || isLoading}
                    className="flex-1 h-11"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="phone">
            {step === "input" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={!phone || isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Sending..." : "Send WhatsApp Code"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-11 text-center text-lg font-mono"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    We sent a 6-digit code via WhatsApp
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={!otp || otp.length !== 6 || isLoading}
                    className="flex-1 h-11"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Login;
