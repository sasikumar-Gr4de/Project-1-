import { useState, useEffect } from "react";
import { ChartColumnDecreasing, Target, TrendingUp } from "lucide-react";
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
            <h1 className="text-4xl lg:text-6xl font-bold font-['Orbitron'] mb-6 leading-tight bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              {content.heroSection?.mainHeading || "Measure Football Talent"}{" "}
              {content.heroSection?.highlightedText || "Objectively"}
            </h1>
            <p className="text-xl text-placeholder mb-8 max-w-2xl font-['Orbitron']">
              {content.heroSection?.subheading ||
                "GR4DE transforms raw match data into actionable insights, combining data science, motion tracking, and elite benchmarks to standardize talent measurement."}
            </p>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-[#94D44A]/10 rounded-full blur-3xl"></div>

              <div className="relative bg-(--surface-2) rounded-2xl p-8 shadow-2xl overflow-visible">
                <div className="space-y-6 overflow-visible">
                  {/* Performance Score Card */}
                  <div className="bg-linear-to-br from-(--surface-1) to-(--surface-1) rounded-xl p-6 overflow-visible">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-white font-['Orbitron']">
                          Player Performance Score
                        </h3>
                        <p className="text-placeholder text-sm font-['Orbitron']">
                          Current Session
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary font-['Orbitron']">
                          87.4
                        </div>
                        <div className="text-sm text-placeholder font-['Orbitron']">
                          GR4DE Score
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-white">
                          92
                        </div>
                        <div className="text-xs text-(--color-blue) font-['Orbitron']">
                          Technical
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          85
                        </div>
                        <div className="text-xs text-(--color-orange) font-['Orbitron']">
                          Physical
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          84
                        </div>
                        <div className="text-xs text-(--primary) font-['Orbitron']">
                          Tactical
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          84
                        </div>
                        <div className="text-xs text-(--color-purple) font-['Orbitron'] ">
                          Mental
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-linear-to-br from-(--surface-1) to-(--surface-1) rounded-xl p-6 overflow-visible">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-3">
                          <ChartColumnDecreasing className="text-primary h-12 w-12 py-2" />
                          <div className="col-span-2">
                            <div className="font-bold">Match Data</div>
                            <div className="font-['Orbitron'] text-sm text-placeholder">
                              Analyzed
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-linear-to-br from-(--surface-1) to-(--surface-1) rounded-xl p-6 overflow-visible">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-3">
                          <Target className="text-primary h-12 w-12 py-2" />
                          <div className="col-span-2">
                            <div className="font-bold">GPS Tracking</div>
                            <div className="font-['Orbitron'] text-sm text-placeholder">
                              Real-Time
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
