// components/passport/IdentitySection.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, MapPin, Flag } from "lucide-react";

const IdentitySection = ({ identity, verifications }) => {
  if (!identity) {
    return (
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 text-(--muted-text) mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Identity Information
          </h3>
          <p className="text-(--muted-text)">
            No identity information available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Full Name
              </label>
              <p className="text-white font-semibold">
                {identity.first_name} {identity.last_name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Date of Birth
              </label>
              <p className="text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-(--muted-text)" />
                {new Date(identity.date_of_birth).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Nationality
              </label>
              <p className="text-white flex items-center">
                {/* <Flag className="w-4 h-4 mr-2 text-(--muted-text)" /> */}
                {identity.nationality}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Position
              </label>
              <p className="text-white">{identity.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-(--surface-1) border-(--surface-2)">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Gardner Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Name
              </label>
              <p className="text-white">{identity.guardian_name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Email
              </label>
              <p className="text-white">{identity.guardian_email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-(--muted-text)">
                Phone
              </label>
              <p className="text-white">
                {identity.gardian_phone || "Not provided"}
              </p>
            </div>

            {identity.address && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-(--muted-text)">
                  Address
                </label>
                <p className="text-white flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-(--muted-text)" />
                  {identity.address}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentitySection;
