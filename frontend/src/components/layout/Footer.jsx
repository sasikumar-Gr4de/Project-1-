import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto shrink-0">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm order-2 md:order-1">
            <div className="text-muted-foreground text-center sm:text-left">
              © {currentYear} GR4DE Platform. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-4 text-sm order-1 md:order-2">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap text-xs sm:text-sm"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap text-xs sm:text-sm"
            >
              Support
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap text-xs sm:text-sm"
            >
              Privacy
            </a>
          </div>

          {/* Stats and Status - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 text-sm order-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-600 whitespace-nowrap">
                Systems Operational
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Info */}
        <div className="mt-4 pt-4 border-t border-border md:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground gap-4">
            <div className="truncate">Last updated: Just now</div>
            <div className="whitespace-nowrap">Server: EU-West-1</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
