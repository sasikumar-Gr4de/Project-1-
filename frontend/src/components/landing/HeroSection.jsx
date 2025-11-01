import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VideoPlayer from "@/components/common/VideoPlayer";

const HeroSection = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!content) return null;

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex flex-col lg:flex-row items-center justify-between transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6 border border-primary/30">
              <TrendingUp className="h-4 w-4 mr-2" />
              {content.heroSection?.tagline || "AI-Powered Football Analytics"}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-['Orbitron'] mb-6 leading-tight bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              {content.heroSection?.mainHeading || "Measure Football Talent"}
              <span className="text-primary">
                {" "}
                {content.heroSection?.highlightedText || "Objectively"}
              </span>
            </h1>
            <p className="text-xl text-[#B0AFAF] mb-8 max-w-2xl font-['Orbitron']">
              {content.heroSection?.subheading ||
                "GR4DE transforms raw match data into actionable insights, combining data science, motion tracking, and elite benchmarks to standardize talent measurement."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-8 py-4 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="#demo">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-xl px-8 py-4 text-lg h-14"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-[#94D44A]/10 rounded-full blur-3xl"></div>

              {content.heroSection?.demoVideoUrl ? (
                <div className="relative bg-[#262626] border border-[#343434] rounded-2xl p-4 shadow-2xl overflow-visible">
                  <VideoPlayer
                    videoUrl={content.heroSection.demoVideoUrl}
                    title="GR4DE Platform Demo"
                  />
                </div>
              ) : (
                // Fallback to the original card if no video
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
