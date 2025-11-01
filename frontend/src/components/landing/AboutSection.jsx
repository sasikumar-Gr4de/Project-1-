import { Target, Trophy } from "lucide-react";

const AboutSection = ({ content }) => {
  const defaultContent = {
    heading: "About GR4DE",
    description:
      "GR4DE is a performance analytics platform that scores youth footballers based on match data, GPS tracking, and elite benchmarks.",
    goalTitle: "Our Goal",
    goalDescription:
      "Standardize how football talent is measured, developed, and discovered globally.",
    missionTitle: "Our Mission",
    missionDescription:
      "Transform raw match data into actionable insights using AI-driven performance intelligence.",
  };

  const sectionContent = content?.aboutSection || defaultContent;

  return (
    <section id="about" className="py-16 px-4 bg-[#1A1A1A]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-['Orbitron'] mb-6 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
              {sectionContent.heading}
            </h2>
            <p className="text-lg text-[#B0AFAF] mb-8 font-['Orbitron']">
              {sectionContent.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Target className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sectionContent.goalTitle}
                  </h3>
                  <p className="text-[#B0AFAF]">
                    {sectionContent.goalDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Trophy className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sectionContent.missionTitle}
                  </h3>
                  <p className="text-[#B0AFAF]">
                    {sectionContent.missionDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Precision Scoring
              </h3>
              <p className="text-[#B0AFAF] text-sm">
                Objective performance metrics based on elite football benchmarks
              </p>
            </div>

            <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Talent Development
              </h3>
              <p className="text-[#B0AFAF] text-sm">
                Identify and nurture promising players with data-driven insights
              </p>
            </div>

            <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-[#B0AFAF] text-sm">
                Monitor player development over time with comprehensive
                analytics
              </p>
            </div>

            <div className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Benchmark Analysis
              </h3>
              <p className="text-[#B0AFAF] text-sm">
                Compare players against professional standards and peer groups
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
