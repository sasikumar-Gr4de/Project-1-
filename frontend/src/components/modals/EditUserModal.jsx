import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Shield,
  Users,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { capitalize } from "@/utils/helper.utils";
import { formatDate } from "@/utils/formatter.utils";

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    role: "",
    client_type: "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone_number: user.phone_number || "",
        role: user.role || "",
        client_type: user.client_type || "",
        is_active: user.is_active ?? true,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        toast({
          title: "Error",
          description: "Full name is required",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      if (!formData.role) {
        toast({
          title: "Error",
          description: "Role is required",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      if (!formData.client_type) {
        toast({
          title: "Error",
          description: "Client type is required",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const submitData = {
        ...formData,
        full_name: formData.full_name.trim(),
        phone_number: formData.phone_number.trim() || null,
      };

      await onSave(submitData);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const roleOptions = [
    { value: "admin", label: "Admin", description: "Full system access" },
    {
      value: "coach",
      label: "Coach",
      description: "Team and player management",
    },
    { value: "player", label: "Player", description: "Player profile access" },
    { value: "parent", label: "Parent", description: "Player guardian access" },
    {
      value: "data-reviewer",
      label: "Data Reviewer",
      description: "Match data analysis",
    },
    {
      value: "annotator",
      label: "Annotator",
      description: "Video annotation access",
    },
  ];

  const clientTypeOptions = [
    {
      value: "internal",
      label: "Internal",
      description: "System staff member",
    },
    { value: "external", label: "External", description: "External user" },
  ];

  const statusOptions = [
    {
      value: "true",
      label: "Active",
      description: "User can access the system",
    },
    {
      value: "false",
      label: "Inactive",
      description: "User account is disabled",
    },
  ];

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <UserCheck className="w-4 h-4 text-green-600" />
    ) : (
      <UserX className="w-4 h-4 text-red-600" />
    );
  };

  const getRoleIcon = (role) => {
    return <Shield className="w-4 h-4 text-blue-600" />;
  };

  const getClientTypeIcon = (clientType) => {
    return <Users className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="shrink-0 border-b bg-linear-to-r from-card to-card/80">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold">Edit User</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Update user information and permissions
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              disabled={isSending}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Scrollable Body */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                {/* <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div> */}
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <Label
                    htmlFor="full_name"
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    <span>Full Name</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    placeholder="Enter full name"
                    disabled={isSending}
                    className="w-full"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    placeholder="Enter phone number"
                    disabled={isSending}
                    className="w-full"
                  />
                </div>

                {/* Role */}
                <div className="space-y-3">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    {getRoleIcon()}
                    <span>Role</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    disabled={isSending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Type */}
                <div className="space-y-3">
                  <Label
                    htmlFor="client_type"
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    {getClientTypeIcon()}
                    <span>Client Type</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.client_type}
                    onValueChange={(value) =>
                      handleInputChange("client_type", value)
                    }
                    disabled={isSending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label
                    htmlFor="is_active"
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    {getStatusIcon(formData.is_active)}
                    <span>Status</span>
                  </Label>
                  <Select
                    value={formData.is_active.toString()}
                    onValueChange={(value) =>
                      handleInputChange("is_active", value === "true")
                    }
                    disabled={isSending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select user status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4 text-green-600" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-muted/50 text-muted-foreground border-muted"
                    placeholder="Email cannot be changed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be modified for security reasons
                  </p>
                </div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">User Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-muted/30 rounded-lg border">
                {/* User ID */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs bg-background"
                    >
                      {user?.id ? user.id.substring(0, 8) + "..." : "N/A"}
                    </Badge>
                  </div>
                </div>

                {/* Email Verification Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email Verification
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user?.email_verified ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <Badge
                      variant={user?.email_verified ? "default" : "secondary"}
                      className={`text-xs ${
                        user?.email_verified
                          ? "bg-green-500/10 text-green-700 border-green-200"
                          : "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {user?.email_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Current Status
                  </Label>
                  <Badge
                    variant={user?.is_active ? "default" : "secondary"}
                    className={`text-xs ${
                      user?.is_active
                        ? "bg-green-500/10 text-green-700 border-green-200"
                        : "bg-red-500/10 text-red-700 border-red-200"
                    }`}
                  >
                    {user?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Last Login */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </Label>
                  <p className="text-sm font-medium">
                    {user?.last_login
                      ? formatDate(user.last_login)
                      : "Never logged in"}
                  </p>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </Label>
                  <p className="text-sm font-medium">
                    {user?.created_at ? formatDate(user.created_at) : "N/A"}
                  </p>
                </div>

                {/* Client Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Current Type
                  </Label>
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-500/10 text-blue-700 border-blue-200"
                  >
                    {user?.client_type ? capitalize(user.client_type) : "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Current Selection Summary */}
            {/* <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h4 className="font-semibold text-primary flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Update Summary</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">New Role:</span>
                  <div className="font-medium">
                    {formData.role ? capitalize(formData.role) : "Not selected"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">
                    New Client Type:
                  </span>
                  <div className="font-medium">
                    {formData.client_type
                      ? capitalize(formData.client_type)
                      : "Not selected"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">New Status:</span>
                  <div className="font-medium flex items-center space-x-2">
                    {getStatusIcon(formData.is_active)}
                    <span>{formData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Full Name:</span>
                  <div className="font-medium truncate">
                    {formData.full_name || "Not provided"}
                  </div>
                </div>
              </div>
            </div> */}
          </form>
        </CardContent>

        {/* Fixed Footer */}
        <div className="shrink-0 border-t p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {/* User ID:{" "} */}
              {/* <span className="font-mono text-xs">{user?.id || "N/A"}</span> */}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSending}
                className="min-w-24"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 min-w-24"
                disabled={isSending}
              >
                {isSending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditUserModal;
