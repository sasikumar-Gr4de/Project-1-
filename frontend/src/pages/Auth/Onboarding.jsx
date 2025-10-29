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

  const { updateProfile } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
      // Profile will be updated and user redirected automatically
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-transparent border-none shadow-none">
        <CardHeader className="text-center space-y-4 px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <img src="favicon.png" alt="GR4DE Logo" className="w-20 h-20" />
          </div>
          <CardTitle className="text-2xl font-bold font-['Inter_Tight'] text-primary">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-base font-['Inter_Tight'] text-white">
            Tell us about yourself to get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player Name */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium font-['Inter_Tight']">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-4 h-4 w-4 text-[#E1E5DD]" />
                  <Input
                    placeholder="Enter your full name"
                    value={formData.player_name}
                    onChange={(e) =>
                      handleChange("player_name", e.target.value)
                    }
                    className="pl-10 h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] placeholder:text-[#E1E5DD] placeholder:opacity-70 rounded-[5px] font-['Inter_Tight']"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium font-['Inter_Tight']">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-4 h-4 w-4 text-[#E1E5DD]" />
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                    className="pl-10 h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] placeholder:text-[#E1E5DD] placeholder:opacity-70 rounded-[5px] font-['Inter_Tight']"
                    required
                  />
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-white text-base font-medium font-['Inter_Tight']">
                  Position
                </label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleChange("position", value)}
                >
                  <SelectTrigger className="h-12 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] font-['Inter_Tight']">
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] font-['Inter_Tight']">
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
                <label className="text-white text-base font-medium font-['Inter_Tight']">
                  Academy/Club
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2 h-4 w-4 text-[#E1E5DD] z-10" />
                  <Select
                    value={formData.academy}
                    onValueChange={(value) => handleChange("academy", value)}
                  >
                    <SelectTrigger className="h-12 pl-10 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] font-['Inter_Tight']">
                      <SelectValue placeholder="Select your academy" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] font-['Inter_Tight']">
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
                <label className="text-white text-base font-medium font-['Inter_Tight']">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2 h-4 w-4 text-[#E1E5DD] z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger className="h-12 pl-10 text-base bg-[#343434] border-[#343434] text-[#E1E5DD] rounded-[5px] font-['Inter_Tight']">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#343434] border-[#343434] text-[#E1E5DD] font-['Inter_Tight']">
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

            <Button
              type="submit"
              disabled={
                isLoading || !formData.player_name || !formData.date_of_birth
              }
              className="w-full h-12 text-base font-['Inter_Tight'] bg-primary text-[#0F0F0E] hover:bg-primary/90 font-semibold rounded-[10px]"
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
