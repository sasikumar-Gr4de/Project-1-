import React, { useState, useEffect } from "react";
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
import Tabs from "@/components/common/Tabs";
import { Mail, Phone, ArrowRight } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input");
  const [isLoading, setIsLoading] = useState(false);

  const { sendOtp, login } = useAuthStore();

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = phoneInputStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

  const handleTabChange = (index, tab) => {
    if (step === "verify") {
      resetForm();
    }
  };

  // Updated styles using the exact color palette from Figma
  const phoneInputStyles = `
    /* ===== MAIN CONTAINER ===== */
    .react-tel-input {
      position: relative;
      width: 100% !important;
      font-family: 'Inter Tight', inherit;
    }

    /* ===== INPUT FIELD ===== */
    .react-tel-input .form-control {
      width: 100% !important;
      height: 46px !important;
      font-size: 16px !important;
      background: #343434 !important;
      border: 1px solid #343434 !important;
      border-radius: 5px !important;
      color: #E1E5DD !important;
      padding-left: 60px !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Inter Tight', inherit !important;
      line-height: 1.5 !important;
    }

    .react-tel-input .form-control:hover {
      
      background: #343434 !important;
    }

    .react-tel-input .form-control:focus {
      
      box-shadow: 0 0 0 2px rgba(193, 255, 114, 0.2) !important;
      outline: none !important;
      background: #343434 !important;
    }

    /* ===== FLAG DROPDOWN CONTAINER ===== */
    .react-tel-input .flag-dropdown {
      position: absolute !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      background: #343434 !important;
      border: 1px solid #343434 !important;
      border-radius: 5px 0 0 5px !important;
      border-right: 1px solid #343434 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .react-tel-input .flag-dropdown.open {
      background: #343434 !important;
      border-color: #C1FF72 !important;
      border-bottom-left-radius: 0 !important;
    }

    .react-tel-input .flag-dropdown:hover {
      background: #343434 !important;
    }

    /* ===== SELECTED FLAG BUTTON ===== */
    .react-tel-input .selected-flag {
      background: transparent !important;
      border-radius: 5px 0 0 5px !important;
      width: 54px !important;
      height: 100% !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease-in-out !important;
      position: relative !important;
    }

    .react-tel-input .selected-flag:hover {
      background: #343434 !important;
    }

    /* ===== DROPDOWN ARROW ===== */
    .react-tel-input .selected-flag .arrow {
      position: absolute !important;
      right: 8px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      border-top: 5px solid #E1E5DD !important;
      border-left: 4px solid transparent !important;
      border-right: 4px solid transparent !important;
      transition: all 0.2s ease-in-out !important;
    }

    .react-tel-input .selected-flag .arrow.up {
      border-top: none !important;
      border-bottom: 5px solid #C1FF72 !important;
      transform: translateY(-50%) !important;
    }

    .react-tel-input .flag-dropdown.open .selected-flag .arrow {
      border-top-color: #C1FF72 !important;
    }

    /* ===== COUNTRY LIST DROPDOWN ===== */
    .react-tel-input .country-list {
      background: #343434 !important;
      border: 1px solid #343434 !important;
      border-radius: 0 5px 5px 5px !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
      margin-top: -1px !important;
      width: 340px !important;
      max-height: 320px !important;
      overflow-y: auto !important;
      z-index: 9999 !important;
    }

    /* ===== SEARCH BOX CONTAINER ===== */
    .react-tel-input .country-list .search {
      position: sticky !important;
      top: 0 !important;
      background: #343434 !important;
      padding: 12px !important;
      border-bottom: 1px solid #343434 !important;
      z-index: 1000 !important;
      margin: 0 !important;
    }

    /* ===== SEARCH INPUT ===== */
    .react-tel-input .country-list .search-box {
      background: #0F0F0E !important;
      border: 1px solid #343434 !important;
      border-radius: 5px !important;
      color: #E1E5DD !important;
      width: 100% !important;
      padding: 10px 12px !important;
      font-size: 14px !important;
      font-family: 'Inter Tight', inherit !important;
      margin: 0 !important;
      transition: all 0.2s ease-in-out !important;
    }

    .react-tel-input .country-list .search-box:focus {
      border-color: #C1FF72 !important;
      box-shadow: 0 0 0 2px rgba(193, 255, 114, 0.2) !important;
      outline: none !important;
      background: #0F0F0E !important;
    }

    .react-tel-input .country-list .search-box::placeholder {
      color: #E1E5DD !important;
      opacity: 0.7;
    }

    /* ===== INDIVIDUAL COUNTRY ITEMS ===== */
    .react-tel-input .country-list .country {
      color: #E1E5DD !important;
      background: #343434 !important;
      padding: 12px 16px !important;
      font-size: 14px !important;
      border-bottom: 1px solid rgba(52, 52, 52, 0.5) !important;
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      transition: all 0.15s ease-in-out !important;
      cursor: pointer;
    }

    .react-tel-input .country-list .country:last-child {
      border-bottom: none !important;
    }

    .react-tel-input .country-list .country:hover {
      background: #4a4a4a !important;
      color: #C1FF72 !important;
    }

    .react-tel-input .country-list .country.highlight {
      background: #4a4a4a !important;
      color: #C1FF72 !important;
      border-left: 3px solid #C1FF72 !important;
    }

    /* ===== COUNTRY DIAL CODE ===== */
    .react-tel-input .country-list .dial-code {
      color: #E1E5DD !important;
      font-size: 13px !important;
      font-weight: 500;
      margin-left: auto !important;
      opacity: 0.8;
    }

    .react-tel-input .country-list .country:hover .dial-code {
      color: #C1FF72 !important;
      opacity: 1;
    }

    /* ===== COUNTRY NAME ===== */
    .react-tel-input .country-list .country-name {
      color: inherit !important;
      font-size: 14px !important;
      font-family: 'Inter Tight', inherit !important;
      font-weight: 500;
    }

    /* ===== DIVIDER ===== */
    .react-tel-input .country-list .divider {
      border-bottom: 1px solid #343434 !important;
      margin: 8px 0 !important;
      opacity: 0.5;
    }

    /* ===== NO RESULTS MESSAGE ===== */
    .react-tel-input .country-list .no-entries-message {
      color: #E1E5DD !important;
      padding: 20px 16px !important;
      text-align: center !important;
      font-size: 14px !important;
      background: #343434 !important;
      font-style: italic;
    }

    /* ===== FLAG ICON ===== */
    .react-tel-input .flag {
      transform: scale(1.2) !important;
      margin-right: 0 !important;
      border-radius: 2px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* ===== SCROLLBAR STYLING ===== */
    .react-tel-input .country-list::-webkit-scrollbar {
      width: 8px !important;
    }

    .react-tel-input .country-list::-webkit-scrollbar-track {
      background: #4a4a4a !important;
      border-radius: 4px !important;
      margin: 4px 0;
    }

    .react-tel-input .country-list::-webkit-scrollbar-thumb {
      background: #E1E5DD !important;
      border-radius: 4px !important;
      border: 2px solid #4a4a4a !important;
    }

    .react-tel-input .country-list::-webkit-scrollbar-thumb:hover {
      background: #C1FF72 !important;
    }

    /* Firefox scrollbar */
    .react-tel-input .country-list {
      scrollbar-width: thin !important;
      scrollbar-color: #E1E5DD #4a4a4a !important;
    }
  `;

  const loginTabs = [
    {
      id: "email",
      label: "Email",
      icon: Mail,
      content: (
        <div className="mt-6">
          {step === "input" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] placeholder:text-[#E1E5DD] placeholder:opacity-70 rounded-[5px] font-['Inter']"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={!email || isLoading}
                className="w-full h-12 text-base font-['Inter'] bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12 text-center text-lg font-mono bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px]"
                  maxLength={6}
                />
                <p className="text-sm text-[#E1E5DD] text-center px-2 font-['Inter']">
                  We sent a 6-digit code to {email}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 h-12 text-base font-['Inter'] border-[#343434] text-[#E1E5DD] hover:bg-[#343434] hover:text-[#E1E5DD] rounded-[5px]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={!otp || otp.length !== 6 || isLoading}
                  className="flex-1 h-12 text-base font-['Inter'] bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "phone",
      label: "WhatsApp",
      icon: Phone,
      content: (
        <div className="mt-6">
          {step === "input" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                {/* <label className="text-white text-base font-medium font-['Inter']">
                  Phone Number
                </label> */}
                <div className="relative">
                  <PhoneInput
                    country={"us"}
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter phone number"
                    inputProps={{
                      required: true,
                      name: "phone",
                      autoComplete: "tel",
                    }}
                    enableSearch={true}
                    disableSearchIcon={true}
                    searchPlaceholder="Search countries..."
                    containerClass="react-tel-input"
                    inputClass="form-control"
                    autoFormat={true}
                  />
                </div>
                <p className="text-xs text-[#E1E5DD] px-1 mt-2 font-['Inter']">
                  We'll send a verification code via WhatsApp
                </p>
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={!phone || isLoading}
                className="w-full h-12 text-base font-['Inter'] bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
              >
                {isLoading ? "Sending..." : "Send WhatsApp Code"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12 text-center text-lg font-mono bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px]"
                  maxLength={6}
                />
                <p className="text-sm text-[#E1E5DD] text-center px-2 font-['Inter']">
                  We sent a 6-digit code via WhatsApp to {phone}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 h-12 text-base font-['Inter'] border-[#343434] text-[#E1E5DD] hover:bg-[#343434] hover:text-[#E1E5DD] rounded-[5px]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={!otp || otp.length !== 6 || isLoading}
                  className="flex-1 h-12 text-base font-['Inter'] bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-transparent border-none shadow-none">
        <CardHeader className="text-center space-y-4 px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <img src="favicon.png" alt="GR4DE Logo" className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl sm:text-2xl font-bold font-['Inter'] text-primary">
            Log in
          </CardTitle>
          <CardDescription className="text-base font-['Inter'] text-white px-2">
            Welcome Back! Please enter your details
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <Tabs
            tabs={loginTabs}
            defaultTab={0}
            onTabChange={handleTabChange}
            variant="underline"
            size="md"
            fullWidth={true}
            responsive={true}
            className="w-full"
          />

          {/* <div className="mt-8 text-center">
            <p className="text-base font-['Inter'] text-white">
              Don't have an account?{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
