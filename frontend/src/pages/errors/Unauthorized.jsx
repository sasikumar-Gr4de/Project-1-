import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldAlert, Home, ArrowLeft, LogIn, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Unauthorized = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this page
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              This area requires special permissions that your current account doesn't have.
            </p>
            
            {user && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  Logged in as: <span className="font-medium text-blue-600">{user.email}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Role: <span className="font-medium text-blue-600">{user.role}</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Link to="/dashboard" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>

            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
            ) : (
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2 text-center">
              Need elevated permissions?
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Request Access
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;