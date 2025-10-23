import React from "react";
import { Circle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright and Links */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            {/* <div className="flex items-center space-x-2">
              <img src="/GR4DE.png" alt="GR4DE" className="h-4 w-4" />
              <span className="font-semibold text-foreground">
                GR4DE Platform
              </span>
            </div> */}
            <div className="text-muted-foreground">
              © {currentYear} All rights reserved.
            </div>
          </div>

          {/* Stats and Status */}
          <div className="flex items-center space-x-6 text-sm">
            {/* <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="font-semibold text-foreground">v1.2.0</div>
                <div className="text-xs text-muted-foreground">Version</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-500">98%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div> */}

            {/* <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-600">
                All Systems Operational
              </span>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-4 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>

        {/* Mobile Bottom Info */}
        <div className="mt-4 pt-4 border-t border-border md:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Last updated: Just now</div>
            <div>Server: EU-West-1</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
