import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sanityService } from "@/services/sanity.service";

// Import components
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AboutSection from "@/components/landing/AboutSection";
import GallerySection from "@/components/landing/GallerySection";
import CTASection from "@/components/landing/CTASection";

const Landing = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const landingContent = await sanityService.getLandingPageContent();
        setContent(landingContent);
      } catch (error) {
        console.error("Error fetching landing page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Remove the useEffect that overrides body styles - let CSS handle it
  // The background will now scroll with content naturally

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading GR4DE Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-(--surface-1)/80 backdrop-blur-md border-b border-(--surface-2)">
        <div className="mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
                src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                alt="GR4DE Logo"
                className="w-24 h-14 object-contain"
              />
            </div>

            <Link to="/login">
              <Button className="bg-linear-to-r from-primary to-secondary text-(--surface-0) hover:from-secondary hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection content={content} />

      {/* About Section */}
      <AboutSection content={content} />

      {/* How It Works Section */}
      <HowItWorksSection content={content} />

      {/* Gallery Section */}
      <GallerySection content={content} />

      {/* CTA Section */}
      <CTASection content={content} />

      {/* Footer */}
      <footer className="py-12 px-4 bg-transparent">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img
                src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                alt="GR4DE Logo"
                className="w-24 h-14 object-contain"
              />
              <p className="text-sm text-placeholder mt-2 font-['Orbitron']">
                The Game Reads you Back
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-placeholder font-['Orbitron']">
                AI-Powered Football Performance Analytics
              </p>
              <p className="text-sm text-placeholder mt-2 font-['Orbitron']">
                © 2025 GR4DE. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
