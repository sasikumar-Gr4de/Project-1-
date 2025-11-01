import { BarChart3, Cpu, Shield, Users } from "lucide-react";

const FeaturesSection = ({ content }) => {
  const defaultFeatures = [
    {
      title: "Data Analytics",
      description: "Comprehensive match data analysis with advanced metrics",
      icon: "BarChart3",
    },
    {
      title: "AI Processing",
      description:
        "Machine learning algorithms for accurate performance scoring",
      icon: "Cpu",
    },
    {
      title: "Elite Benchmarks",
      description: "Compare against professional standards and benchmarks",
      icon: "Shield",
    },
    {
      title: "Talent Discovery",
      description: "Identify and develop promising young football talent",
      icon: "Users",
    },
  ];

  const iconMap = {
    BarChart3,
    Cpu,
    Shield,
    Users,
  };

  const features = content?.featuresSection?.features || defaultFeatures;

  return (
    <section id="features" className="py-16 px-4 bg-[#0F0F0E]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.featuresSection?.heading || "Powerful Features"}
          </h2>
          <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            {content?.featuresSection?.subheading ||
              "Everything you need to measure, analyze, and develop football talent with precision"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || BarChart3;
            return (
              <div
                key={index}
                className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group hover:transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-['Orbitron']">
                  {feature.title}
                </h3>
                <p className="text-[#B0AFAF] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-['Orbitron'] mb-2">
              99.9%
            </div>
            <div className="text-[#B0AFAF] text-sm">Data Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-['Orbitron'] mb-2">
              50+
            </div>
            <div className="text-[#B0AFAF] text-sm">Performance Metrics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-['Orbitron'] mb-2">
              24/7
            </div>
            <div className="text-[#B0AFAF] text-sm">Real-time Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
