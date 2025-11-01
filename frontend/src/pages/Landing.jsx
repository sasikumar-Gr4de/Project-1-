import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sanityService } from "@/services/sanity.service";

// Import components
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";

// Import existing sections (to be updated with CMS)
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0E] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="landing-page bg-[#0F0F0E] text-white">
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#262626]/80 backdrop-blur-md border-b border-[#343434]">
          <div className="mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                  alt="GR4DE Logo"
                  className="w-24 h-14 object-contain"
                />
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-[#B0AFAF] hover:text-white transition-colors font-['Orbitron']"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-[#B0AFAF] hover:text-white transition-colors font-['Orbitron']"
                >
                  How It Works
                </a>
                {/* <a
                  href="#pricing"
                  className="text-[#B0AFAF] hover:text-white transition-colors font-['Orbitron']"
                >
                  Pricing
                </a> */}
                <a
                  href="#about"
                  className="text-[#B0AFAF] hover:text-white transition-colors font-['Orbitron']"
                >
                  About
                </a>
              </div>

              <Link to="/login">
                <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300">
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

        {/* Features Section */}
        <FeaturesSection content={content} />

        {/* How It Works Section */}
        <HowItWorksSection content={content} />

        {/* Testimonials Section */}
        <TestimonialsSection content={content} />

        {/* Gallery Section */}
        <GallerySection content={content} />

        {/* Pricing Section */}
        {/* <PricingSection content={content} /> */}

        {/* CTA Section */}
        <CTASection content={content} />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-[#343434] bg-[#1A1A1A]">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <img
                  src="https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/serverfavicon-flat.png-1761828572874-cz3vcaezhrb"
                  alt="GR4DE Logo"
                  className="w-24 h-14 object-contain"
                />
                <p className="text-sm text-[#B0AFAF] mt-2 font-['Orbitron']">
                  The Game Reads you Back
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-[#B0AFAF] font-['Orbitron']">
                  AI-Powered Football Performance Analytics
                </p>
                <p className="text-sm text-[#B0AFAF] mt-2 font-['Orbitron']">
                  © 2025 GR4DE. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
