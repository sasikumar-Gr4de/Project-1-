import { Cpu, BarChart3, Star, Target, Users, Zap } from "lucide-react";

const HowItWorksSection = ({ content }) => {
  const iconMap = {
    Cpu,
    BarChart3,
    Star,
    Target,
    Users,
    Zap,
  };

  const defaultSteps = [
    {
      stepNumber: "1",
      title: "Data Collection",
      description:
        "Capture match data, GPS tracking, and performance metrics through advanced sensors and video analysis",
      icon: "Cpu",
    },
    {
      stepNumber: "2",
      title: "AI Analysis",
      description:
        "Our algorithms process data against elite benchmarks to generate objective performance scores",
      icon: "BarChart3",
    },
    {
      stepNumber: "3",
      title: "Talent Scoring",
      description:
        "Receive comprehensive GR4DE scores and actionable insights for player development",
      icon: "Star",
    },
  ];

  const steps = content?.howItWorksSection?.steps || defaultSteps;

  return (
    <section id="how-it-works" className="py-16 px-4 bg-secondary-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.howItWorksSection?.heading || "How GR4DE Works"}
          </h2>
          <p className="text-placeholder max-w-2xl mx-auto font-['Orbitron'] m-5 p-5">
            {content?.howItWorksSection?.subheading ||
              "Our AI-driven platform combines multiple data sources to deliver comprehensive performance insights"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Cpu;
            return (
              <div
                key={index}
                className="text-center group bg-(--surface-2) p-5 rounded-2xl"
              >
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-xl font-semibold text-white shrink-0 px-5">
                    {step.title}
                  </h3>
                  <h1 className="text-[160px] lg:text-[180px] text-transparent bg-clip-text font-extrabold bg-linear-to-b from-primary-400 to-(--surface-2) leading-none absolute right-0 top-16 transform -translate-y-1/1 font-['Orbitron']">
                    {step.stepNumber}
                  </h1>
                </div>

                <p className="text-placeholder leading-relaxed mt-4 text-left p-5">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
