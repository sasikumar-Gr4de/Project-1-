import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShieldAlert, Home, ArrowLeft, LogIn, Mail, Trophy } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Unauthorized = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700 relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">
              <ShieldAlert className="h-10 w-10 text-orange-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Access Denied
          </CardTitle>
          <p className="text-gray-300 mt-2">
            You don't have permission to access this page
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              This area requires special permissions that your current account doesn't have.
            </p>
            
            {user && (
              <div className="bg-gray-700/50 p-3 rounded-lg mb-4 border border-gray-600">
                <p className="text-sm text-gray-300">
                  Logged in as: <span className="font-medium text-blue-400">{user.email}</span>
                </p>
                <p className="text-sm text-gray-300">
                  Role: <span className="font-medium text-blue-400">{user.role}</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Link to="/dashboard" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>

            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
            ) : (
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2 text-center">
              Need elevated permissions?
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
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