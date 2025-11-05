import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePassportStore } from "@/store/passportStore";
import { useToast } from "@/contexts/ToastContext";
import {
  FormInput,
  FormSelect,
  FormGroup,
  FormSection,
  FormDate,
} from "@/components/common/FormComponents";
import HeadshotUpload from "@/components/passport/HeadshotUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Ruler,
  Scale,
  Footprints,
  Target,
  Save,
  CheckCircle,
} from "lucide-react";

const IdentityForm = ({ onComplete, currentStep }) => {
  const { user } = useAuthStore();
  const { passport, updatePlayerIdentity } = usePassportStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (passport?.identity) {
      setFormData(passport.identity);
    }
  }, [passport]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name?.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name?.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.nationality?.trim())
      newErrors.nationality = "Nationality is required";
    if (!formData.headshot_url) newErrors.headshot = "Headshot is required";

    if (formData.dob) {
      const dob = new Date(formData.dob);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 6 || age > 60)
        newErrors.dob = "Player age must be between 6 and 60 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePlayerIdentity(user.id, formData);
      toast({
        title: "Success",
        description: "Identity information saved successfully",
        variant: "success",
      });
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Failed to update identity:", error);
      toast({
        title: "Error",
        description: "Failed to save identity information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isIdentityComplete = () => {
    const required = [
      "first_name",
      "last_name",
      "dob",
      "nationality",
      "headshot_url",
    ];

    return required.every(
      (field) => formData[field] && String(formData[field]).trim().length > 0
    );
  };

  const footOptions = [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "both", label: "Both" },
  ];

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Complete your personal details for player verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormGroup className="space-y-6">
            <FormSection title="Required Information">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  id="first_name"
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="Enter first name"
                  icon={User}
                  error={errors.first_name}
                  required
                />

                <FormInput
                  id="last_name"
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Enter last name"
                  icon={User}
                  error={errors.last_name}
                  required
                />

                <FormDate
                  id="dob"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(value) => handleInputChange("dob", value)}
                  placeholder="Select your date of birth"
                  error={errors.dob}
                  required
                />

                <FormInput
                  id="nationality"
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                  placeholder="Enter nationality"
                  icon={MapPin}
                  error={errors.nationality}
                  required
                />
              </div>

              {formData.dob && !errors.dob && (
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    Age:{" "}
                    {new Date().getFullYear() -
                      new Date(formData.dob).getFullYear()}{" "}
                    years
                  </Badge>
                </div>
              )}
            </FormSection>

            <FormSection title="Additional Information">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  id="height_cm"
                  label="Height (cm)"
                  type="number"
                  value={formData.height_cm}
                  onChange={(e) =>
                    handleInputChange(
                      "height_cm",
                      parseInt(e.target.value) || ""
                    )
                  }
                  placeholder="Height in cm"
                  icon={Ruler}
                  error={errors.height_cm}
                  min="100"
                  max="250"
                />

                <FormInput
                  id="weight_kg"
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight_kg}
                  onChange={(e) =>
                    handleInputChange(
                      "weight_kg",
                      parseInt(e.target.value) || ""
                    )
                  }
                  placeholder="Weight in kg"
                  icon={Scale}
                  error={errors.weight_kg}
                  min="30"
                  max="150"
                />

                <FormSelect
                  id="preferred_foot"
                  label="Preferred Foot"
                  value={formData.preferred_foot}
                  onValueChange={(value) =>
                    handleInputChange("preferred_foot", value)
                  }
                  placeholder="Select foot"
                  options={footOptions}
                  icon={Footprints}
                />

                <div className="md:col-span-2 lg:col-span-3">
                  <FormInput
                    id="positions"
                    label="Positions"
                    value={
                      formData.positions ? formData.positions.join(", ") : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "positions",
                        e.target.value
                          .split(",")
                          .map((p) => p.trim())
                          .filter((p) => p)
                      )
                    }
                    placeholder="e.g. CM, CDM, LW (comma separated)"
                    icon={Target}
                  />
                  <p className="text-[#B0AFAF] text-sm mt-1">
                    Enter positions separated by commas
                  </p>
                </div>
              </div>
            </FormSection>
          </FormGroup>
        </CardContent>
      </Card>

      {/* Headshot Upload */}
      <HeadshotUpload
        onComplete={(headshotUrl) =>
          handleInputChange("headshot_url", headshotUrl)
        }
        currentHeadshot={formData.headshot_url}
      />

      {/* Guardian Information */}
      <Card className="bg-[#262626] border-[#343434]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Guardian Information
          </CardTitle>
          <CardDescription className="text-[#B0AFAF]">
            Required for players under 18 years old
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormGroup>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                id="guardian_name"
                label="Guardian Name"
                value={formData.guardian_name}
                onChange={(e) =>
                  handleInputChange("guardian_name", e.target.value)
                }
                placeholder="Guardian full name"
              />

              <FormInput
                id="guardian_email"
                label="Guardian Email"
                type="email"
                value={formData.guardian_email}
                onChange={(e) =>
                  handleInputChange("guardian_email", e.target.value)
                }
                placeholder="guardian@email.com"
              />

              <FormInput
                id="guardian_phone"
                label="Guardian Phone"
                type="tel"
                value={formData.guardian_phone}
                onChange={(e) =>
                  handleInputChange("guardian_phone", e.target.value)
                }
                placeholder="+1234567890"
              />
            </div>
          </FormGroup>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex items-center justify-between p-6 bg-[#1A1A1A] border border-[#343434] rounded-xl">
        <div className="flex items-center space-x-2">
          {isIdentityComplete() && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Identity Complete
            </Badge>
          )}
          <span className="text-sm text-[#B0AFAF]">
            {isIdentityComplete()
              ? "Ready for document upload"
              : "Complete all required fields"}
          </span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isIdentityComplete()}
          className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};

export default IdentityForm;
