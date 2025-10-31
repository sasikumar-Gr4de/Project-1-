import { useState, useEffect } from "react";

import {
  Trophy,
  Target,
  BarChart3,
  Cpu,
  Shield,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Example images - replace these with your actual images
  const galleryImages = [
    {
      id: 1,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server1.jpg-1761338438160-rmsqr6wybrn",
      alt: "Football match analysis",
      title: "Match Performance Tracking",
      description: "Real-time data collection during live matches",
    },
    {
      id: 2,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server2.jpg-1761338488620-0rdjp464vtg",
      alt: "Player analytics dashboard",
      title: "Performance Dashboard",
      description: "Comprehensive player insights and metrics",
    },
    {
      id: 3,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server3.jpg-1761338527588-i8o4q27ndl",
      alt: "Team strategic analysis",
      title: "Team Performance",
      description: "Team-wide analytics and strategic insights",
    },
    {
      id: 4,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server8.jpg-1761338560319-85ae20q13as",
      alt: "Youth football training",
      title: "Talent Development",
      description: "Identifying and nurturing young football talent",
    },
  ];

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

                {/* <span className="text-xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
                  GR4DE
                </span> */}
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
        <section className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div
              className={`flex flex-col lg:flex-row items-center justify-between transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6 border border-primary/30">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  AI-Powered Football Analytics
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold font-['Orbitron'] mb-6 leading-tight bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
                  Measure Football Talent
                  <span className="text-primary"> Objectively</span>
                </h1>
                <p className="text-xl text-[#B0AFAF] mb-8 max-w-2xl font-['Orbitron']">
                  GR4DE transforms raw match data into actionable insights,
                  combining data science, motion tracking, and elite benchmarks
                  to standardize talent measurement.
                </p>
              </div>

              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-[#94D44A]/10 rounded-full blur-3xl"></div>

                  <div className="relative bg-[#262626] border border-[#343434] rounded-2xl p-8 shadow-2xl overflow-visible">
                    <div className="space-y-6 overflow-visible">
                      {/* Performance Score Card */}
                      <div className="bg-linear-to-br from-[#1A1A1A] to-[#262626] rounded-xl p-6 border border-[#343434] overflow-visible">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-white font-['Orbitron']">
                              Player Performance Score
                            </h3>
                            <p className="text-[#B0AFAF] text-sm font-['Orbitron']">
                              Current Session
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary font-['Orbitron']">
                              87.4
                            </div>
                            <div className="text-sm text-[#B0AFAF] font-['Orbitron']">
                              GR4DE Score
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-white">
                              92
                            </div>
                            <div className="text-xs text-[#B0AFAF] font-['Orbitron']">
                              Technical
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-white">
                              85
                            </div>
                            <div className="text-xs text-[#B0AFAF] font-['Orbitron']">
                              Physical
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-white">
                              84
                            </div>
                            <div className="text-xs text-[#B0AFAF] font-['Orbitron']">
                              Tactical
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4 overflow-visible">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#343434]">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium text-white">
                              Match Data
                            </div>
                            <div className="text-xs text-[#B0AFAF] font-['Orbitron']">
                              Analyzed
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1A1A1A] border border-[#343434]">
                          <Cpu className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium text-white">
                              GPS Tracking
                            </div>
                            <div className="text-xs text-[#B0AFAF] font-['Orbitron']">
                              Real-time
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-[#1A1A1A]">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-['Orbitron'] mb-6 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
                  About GR4DE
                </h2>
                <p className="text-lg text-[#B0AFAF] mb-8 font-['Orbitron']">
                  GR4DE is a performance analytics platform that scores youth
                  footballers based on match data, GPS tracking, and elite
                  benchmarks.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Target className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Our Goal
                      </h3>
                      <p className="text-[#B0AFAF]">
                        Standardize how football talent is measured, developed,
                        and discovered globally.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Trophy className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Our Mission
                      </h3>
                      <p className="text-[#B0AFAF]">
                        Transform raw match data into actionable insights using
                        AI-driven performance intelligence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                  <BarChart3 className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Data Analytics
                  </h3>
                  <p className="text-[#B0AFAF]">
                    Comprehensive match data analysis with advanced metrics
                  </p>
                </div>

                <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                  <Cpu className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    AI Processing
                  </h3>
                  <p className="text-[#B0AFAF]">
                    Machine learning algorithms for accurate performance scoring
                  </p>
                </div>

                <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Elite Benchmarks
                  </h3>
                  <p className="text-[#B0AFAF]">
                    Compare against professional standards and benchmarks
                  </p>
                </div>

                <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Talent Discovery
                  </h3>
                  <p className="text-[#B0AFAF]">
                    Identify and develop promising young football talent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-[#0F0F0E]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
                How GR4DE Works
              </h2>
              <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
                Our AI-driven platform combines multiple data sources to deliver
                comprehensive performance insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-[#0F0F0E]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  1. Data Collection
                </h3>
                <p className="text-[#B0AFAF]">
                  Capture match data, GPS tracking, and performance metrics
                  through advanced sensors and video analysis
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-[#0F0F0E]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  2. AI Analysis
                </h3>
                <p className="text-[#B0AFAF]">
                  Our algorithms process data against elite benchmarks to
                  generate objective performance scores
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    <Star className="h-6 w-6 text-[#0F0F0E]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  3. Talent Scoring
                </h3>
                <p className="text-[#B0AFAF]">
                  Receive comprehensive GR4DE scores and actionable insights for
                  player development
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 px-4 bg-[#1A1A1A]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
                GR4DE In Action
              </h2>
              <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
                See how clubs and academies are transforming talent assessment
                with our platform
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group bg-[#262626] border border-[#343434] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/30"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-primary transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm text-[#B0AFAF] group-hover:text-white/80 transition-colors">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-[#0F0F0E]">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold font-['Orbitron'] mb-6 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              Ready to Transform Football Talent Assessment?
            </h2>
            <p className="text-xl text-[#B0AFAF] mb-8 max-w-2xl mx-auto font-['Orbitron']">
              Join clubs and academies worldwide using GR4DE to objectively
              measure and develop football talent
            </p>
            <Link to="/login">
              <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-8 py-4 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>

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
