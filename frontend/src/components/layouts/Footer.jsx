import React from "react";
import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800/80 backdrop-blur-md border-t border-gray-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">
                Enterprise Grade Security
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-400">Made for Football</span>
            </div>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors"
            >
              Support
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Gr4de Football Analytics. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Advanced football performance analytics platform powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
