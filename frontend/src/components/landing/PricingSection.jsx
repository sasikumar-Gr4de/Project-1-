import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PricingSection = ({ content }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would typically fetch from your Stripe API
    const fetchPlans = async () => {
      try {
        // Mock data - replace with actual Stripe API call
        const mockPlans = [
          {
            id: "starter",
            name: "Starter",
            price: 29,
            period: "month",
            description: "Perfect for individual players and parents",
            features: [
              "Basic performance tracking",
              "Up to 5 match analyses per month",
              "Individual GR4DE scoring",
              "Basic progress reports",
              "Email support",
            ],
            popular: false,
          },
          {
            id: "pro",
            name: "Professional",
            price: 99,
            period: "month",
            description: "Ideal for coaches and small academies",
            features: [
              "Advanced performance analytics",
              "Unlimited match analyses",
              "Team GR4DE scoring",
              "Comparative benchmarking",
              "Priority support",
              "Custom report templates",
              "API access",
            ],
            popular: true,
          },
          {
            id: "enterprise",
            name: "Enterprise",
            price: 299,
            period: "month",
            description: "For professional clubs and large organizations",
            features: [
              "Everything in Professional",
              "Dedicated account manager",
              "Custom AI model training",
              "White-label solutions",
              "Advanced data integration",
              "24/7 premium support",
              "SLA guarantee",
            ],
            popular: false,
          },
        ];
        setPlans(mockPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="py-16 px-4 bg-[#0F0F0E]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-pulse">Loading pricing...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-16 px-4 bg-[#0F0F0E]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.pricingSection?.heading || "Simple, Transparent Pricing"}
          </h2>
          <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            {content?.pricingSection?.subheading ||
              "Choose the plan that works best for your needs. All plans include a 14-day free trial."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-[#262626] border rounded-xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-[#343434] hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2 font-['Orbitron']">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-white font-['Orbitron']">
                    ${plan.price}
                  </span>
                  <span className="text-[#B0AFAF] ml-2">/{plan.period}</span>
                </div>
                <p className="text-[#B0AFAF] text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span className="text-[#B0AFAF] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary"
                      : "bg-transparent border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#B0AFAF] text-sm">
            Need a custom solution?{" "}
            <a href="#contact" className="text-primary hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
