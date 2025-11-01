// pages/Auth/Onboarding.jsx - Enhanced version
import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FOOTBALL_POSITIONS, COUNTRIES, ACADEMIES } from "@/utils/constants";
import { User, Calendar, MapPin, Building } from "lucide-react";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    player_name: "",
    date_of_birth: "",
    position: "",
    academy: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { updateProfile, user } = useAuthStore();
  const navigate = useNavigate();

  // If user already completed onboarding, redirect to dashboard
  React.useEffect(() => {
    if (user?.player_name) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await updateProfile(formData);
      // Navigation will be handled by the auth store update and ProtectedRoute
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate minimum and maximum dates for date input (ages 8-40)
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 40,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(
    today.getFullYear() - 8,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-transparent border-none shadow-none">
        <CardHeader className="text-center space-y-4 px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <img
              src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon.png-1761828500393-y4b46hwju9k"
              alt="GR4DE Logo"
              className="w-20 h-20"
            />
          </div>
          <CardTitle className="text-2xl font-bold  text-primary">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-base  text-white">
            Tell us about yourself to get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
              <p className="text-red-400 text-sm ">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player Name */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium ">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-4 h-4 w-4 text-[#E1E5DD]" />
                  <Input
                    placeholder="Enter your full name"
                    value={formData.player_name}
                    onChange={(e) =>
                      handleChange("player_name", e.target.value)
                    }
                    className="pl-10 h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] placeholder:text-[#E1E5DD] placeholder:opacity-70 rounded-[5px] "
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium ">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-4 h-4 w-4 text-[#E1E5DD]" />
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                    min={minDate}
                    max={maxDate}
                    className="pl-10 h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] placeholder:text-[#E1E5DD] placeholder:opacity-70 rounded-[5px] "
                    required
                  />
                </div>
                <p className="text-xs text-[#E1E5DD] opacity-70">
                  Must be between 8 and 40 years old
                </p>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium ">
                  Position *
                </label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleChange("position", value)}
                  required
                >
                  <SelectTrigger className="h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] ">
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] ">
                    {FOOTBALL_POSITIONS.map((position) => (
                      <SelectItem
                        key={position}
                        value={position}
                        className="focus:bg-[#4a4a4a] focus:text-primary"
                      >
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Academy */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium ">
                  Academy/Club
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-[#E1E5DD] z-10" />
                  <Select
                    value={formData.academy}
                    onValueChange={(value) => handleChange("academy", value)}
                  >
                    <SelectTrigger className="h-12 pl-10 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] ">
                      <SelectValue placeholder="Select your academy" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] ">
                      {ACADEMIES.map((academy) => (
                        <SelectItem
                          key={academy}
                          value={academy}
                          className="focus:bg-[#4a4a4a] focus:text-primary"
                        >
                          {academy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-white text-base font-medium ">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#E1E5DD] z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger className="h-12 pl-10 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] ">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] ">
                      {COUNTRIES.map((country) => (
                        <SelectItem
                          key={country}
                          value={country}
                          className="focus:bg-[#4a4a4a] focus:text-primary"
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.player_name ||
                  !formData.date_of_birth ||
                  !formData.position
                }
                className="w-full h-12 text-base  bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
              >
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>

              <p className="text-xs text-[#E1E5DD] opacity-70 text-center">
                Fields marked with * are required
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
