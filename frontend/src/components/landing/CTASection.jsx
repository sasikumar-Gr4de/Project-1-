import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = ({ content }) => {
  const defaultContent = {
    heading: "Ready to Transform Football Talent Assessment?",
    subheading:
      "Join clubs and academies worldwide using GR4DE to objectively measure and develop football talent",
    buttonText: "Start Your Free Trial",
  };

  const sectionContent = content?.ctaSection || defaultContent;

  return (
    <section className="py-20 px-4 bg-[#0F0F0E] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#94D44A]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="mx-auto max-w-4xl text-center relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold font-['Orbitron'] mb-6 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
          {sectionContent.heading}
        </h2>
        <p className="text-xl text-placeholder mb-8 max-w-2xl mx-auto font-['Orbitron']">
          {sectionContent.subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <Button className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-8 py-4 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300">
              {sectionContent.buttonText}
            </Button>
          </Link>

          {/* <Link to="/login">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 font-semibold rounded-xl px-8 py-4 text-lg h-14"
            >
              Schedule a Demo
            </Button>
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
