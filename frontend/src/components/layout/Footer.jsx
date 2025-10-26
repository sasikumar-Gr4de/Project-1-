import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} GR4DE Platform. All rights reserved.
          </div>

          {/* Server Info */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="hidden sm:block">Last updated: Just now</div>
            <div>Server: EU-West-1</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
