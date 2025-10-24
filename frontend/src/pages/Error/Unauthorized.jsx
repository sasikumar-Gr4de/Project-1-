import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, Home, AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="container mx-auto max-w-2xl text-center">
        {/* Icon and Status */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-destructive" />
              </div>
              <div className="absolute -top-2 -right-2">
                {/* <AlertTriangle className="h-6 w-6 text-destructive" /> */}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-destructive">
              Access Denied
            </div>
            <h1 className="text-4xl font-bold">Unauthorized Access</h1>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            You don't have permission to access this page. Please log in with
            appropriate credentials or contact your administrator.
          </p>

          {/* Features List */}
          <div className="bg-card/50 rounded-lg p-6 border border-border max-w-md mx-auto">
            <h3 className="font-semibold mb-4">Required Access</h3>
            <ul className="space-y-3 text-sm text-muted-foreground text-left">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Valid user account</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Appropriate permissions</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Authentication token</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild className="gap-2">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Support Info */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact support at support@gr4de.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
