import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            404
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Page Not Found
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500">
              Don't worry, even the best players miss sometimes. Let's get you back on track.
            </p>
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
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Still having trouble?
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;