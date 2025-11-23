import {
  ChartColumnDecreasing,
  Goal,
  Shield,
  Target,
  Trophy,
  Users2,
} from "lucide-react";

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
            <p className="text-lg text-placeholder mb-8 font-['Orbitron']">
              {sectionContent.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Goal className="h-10 w-10 text-primary mt-1 shrink-0 mr-3 " />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sectionContent.goalTitle}
                  </h3>
                  <p className="text-placeholder">
                    {sectionContent.goalDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Trophy className="h-10 w-10 text-primary mt-1 shrink-0 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sectionContent.missionTitle}
                  </h3>
                  <p className="text-placeholder">
                    {sectionContent.missionDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-(--surface-1) rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <ChartColumnDecreasing className="text-primary h-15 w-15 py-2" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Data Analytics
              </h3>
              <p className="text-placeholder text-sm">
                Comprehensive match data analytics with advanced metrics.
              </p>
            </div>

            <div className="bg-(--surface-1) rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <Target className="text-primary h-15 w-15 py-2" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Talent Development
              </h3>
              <p className="text-placeholder text-sm">
                Machine learning algorithms for accurate performance scroing.
              </p>
            </div>

            <div className="bg-(--surface-1) rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <Shield className="text-primary h-15 w-15 py-2" />

              {/* </div> */}
              <h3 className="text-xl font-semibold text-white mb-2">
                Elite Benchmarks
              </h3>
              <p className="text-placeholder text-sm">
                Compare against professional standards and bechmarks
              </p>
            </div>

            <div className="bg-(--surface-1) rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <Users2 className="text-primary h-15 w-15 py-2" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Talent Discovery
              </h3>
              <p className="text-placeholder text-sm">
                Modify and develop promising young football talent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
