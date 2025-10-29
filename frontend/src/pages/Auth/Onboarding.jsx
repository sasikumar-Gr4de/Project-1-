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
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Complete Your Profile
        </CardTitle>
        <CardDescription>
          Tell us about yourself to get personalized insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your full name"
                  value={formData.player_name}
                  onChange={(e) => handleChange("player_name", e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleChange("position", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your position" />
                </SelectTrigger>
                <SelectContent>
                  {FOOTBALL_POSITIONS.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academy */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Academy/Club</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.academy}
                  onValueChange={(value) => handleChange("academy", value)}
                >
                  <SelectTrigger className="h-11 pl-10">
                    <SelectValue placeholder="Select your academy" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIES.map((academy) => (
                      <SelectItem key={academy} value={academy}>
                        {academy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Country</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleChange("country", value)}
                >
                  <SelectTrigger className="h-11 pl-10">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
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
            className="w-full h-11"
          >
            {isLoading ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Onboarding;
