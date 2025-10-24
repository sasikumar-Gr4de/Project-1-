import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="container mx-auto max-w-2xl text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary">404</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">Page Not Found</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. The page
              might have been moved, deleted, or you entered an incorrect URL.
            </p>
          </div>

          {/* Search Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4" />
                Go to Login
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
