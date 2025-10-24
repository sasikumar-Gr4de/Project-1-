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
  ArrowRight,
  Play,
} from "lucide-react";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                {/* <Football className="h-5 w-5 text-primary-foreground" /> */}
              </div>
              <span className="text-xl font-bold">GR4DE</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="#how-it-works"
                className="text-foreground hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>

            <button className="btn-primary px-6 py-2 rounded-md font-medium">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            className={`flex flex-col lg:flex-row items-center justify-between transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI-Powered Football Analytics
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Measure Football Talent
                <span className="text-primary"> Objectively</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                GR4DE transforms raw match data into actionable insights,
                combining data science, motion tracking, and elite benchmarks to
                standardize talent measurement.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* <button className="btn-primary px-8 py-4 rounded-lg font-medium text-lg flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="btn-secondary px-8 py-4 rounded-lg font-medium text-lg flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button> */}
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl card-hover">
                  <div className="space-y-6">
                    {/* Performance Score Card */}
                    <div className="bg-linear-to-br from-card to-muted rounded-xl p-6 border border-border">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Player Performance Score
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Current Session
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">
                            87.4
                          </div>
                          <div className="text-sm text-muted-foreground">
                            GR4DE Score
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">92</div>
                          <div className="text-xs text-muted-foreground">
                            Technical
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">85</div>
                          <div className="text-xs text-muted-foreground">
                            Physical
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">84</div>
                          <div className="text-xs text-muted-foreground">
                            Tactical
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Match Data</div>
                          <div className="text-xs text-muted-foreground">
                            Analyzed
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <Cpu className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">GPS Tracking</div>
                          <div className="text-xs text-muted-foreground">
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
      <section id="about" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About GR4DE</h2>
              <p className="text-lg text-muted-foreground mb-8">
                GR4DE is a performance analytics platform that scores youth
                footballers based on match data, GPS tracking, and elite
                benchmarks.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Target className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Goal</h3>
                    <p className="text-muted-foreground">
                      Standardize how football talent is measured, developed,
                      and discovered globally.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Trophy className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                    <p className="text-muted-foreground">
                      Transform raw match data into actionable insights using
                      AI-driven performance intelligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Data Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive match data analysis with advanced metrics
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <Cpu className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-muted-foreground">
                  Machine learning algorithms for accurate performance scoring
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Elite Benchmarks</h3>
                <p className="text-muted-foreground">
                  Compare against professional standards and benchmarks
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Talent Discovery</h3>
                <p className="text-muted-foreground">
                  Identify and develop promising young football talent
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How GR4DE Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven platform combines multiple data sources to deliver
              comprehensive performance insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Data Collection</h3>
              <p className="text-muted-foreground">
                Capture match data, GPS tracking, and performance metrics
                through advanced sensors and video analysis
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-muted-foreground">
                Our algorithms process data against elite benchmarks to generate
                objective performance scores
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Talent Scoring</h3>
              <p className="text-muted-foreground">
                Receive comprehensive GR4DE scores and actionable insights for
                player development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Football Talent Assessment?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join clubs and academies worldwide using GR4DE to objectively
            measure and develop football talent
          </p>
          {/* <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="btn-primary px-8 py-4 rounded-lg font-medium text-lg">
              Start Your Free Trial
            </button>
            <button className="btn-secondary px-8 py-4 rounded-lg font-medium text-lg">
              Schedule a Demo
            </button>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                {/* <Football className="h-4 w-4 text-primary-foreground" /> */}
              </div>
              <span className="text-xl font-bold">GR4DE</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                AI-Powered Football Performance Analytics
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                © 2024 GR4DE. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
