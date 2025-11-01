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
    <section id="how-it-works" className="py-16 px-4 bg-[#0F0F0E]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.howItWorksSection?.heading || "How GR4DE Works"}
          </h2>
          <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            {content?.howItWorksSection?.subheading ||
              "Our AI-driven platform combines multiple data sources to deliver comprehensive performance insights"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Cpu;
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-[#0F0F0E]" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[#0F0F0E] text-sm font-bold font-['Orbitron']">
                      {step.stepNumber}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 font-['Orbitron']">
                  {step.title}
                </h3>
                <p className="text-[#B0AFAF] leading-relaxed">
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
