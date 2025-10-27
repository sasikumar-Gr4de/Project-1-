import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          {/* Copyright */}
          <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left order-2 md:order-1">
            © {currentYear} GR4DE Platform. All rights reserved.
          </div>

          {/* Server Info */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted-foreground order-1 md:order-2">
            <div className="hidden xs:block">Last updated: Just now</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>EU-West-1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
