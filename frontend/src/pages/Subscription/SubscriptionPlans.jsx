import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { subscriptionService } from "@/services/subscription.service";
import { useToast } from "@/contexts/ToastContext";
import { Loader2, Check, Zap, Target, Award, Sparkles } from "lucide-react";

const SubscriptionPlans = () => {
  const { user, subscription, fetchSubscription } = useUserStore();
  const { showToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadPlans();
    fetchSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      showToast("Failed to load plans", "error");
    }
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      const response = await subscriptionService.createCheckoutSession(
        plan.priceId
      );

      if (response.success) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      showToast("Failed to create checkout session", "error");
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = (planId) => {
    return (
      subscription?.plan_type === planId && subscription?.status === "active"
    );
  };

  const getPlanGradient = (planId, isPopular = false) => {
    if (isCurrentPlan(planId)) {
      return "from-primary to-[#94D44A]";
    }
    if (isPopular) {
      return "from-yellow-500 to-orange-500";
    }
    switch (planId) {
      case "pro":
        return "from-[#60A5FA] to-[#3B82F6]";
      case "elite":
        return "from-[#8B5CF6] to-[#7C3AED]";
      default:
        return "from-[#94D44A] to-primary";
    }
  };

  const getPlanFeatures = (planId) => {
    const baseFeatures = {
      basic: [
        { name: "5 Reports Per Month", included: true },
        { name: "Basic Analytics Dashboard", included: true },
        { name: "Email Support", included: true },
        { name: "30-Day History", included: true },
        { name: "Video Analysis", included: false },
        { name: "Advanced Metrics", included: false },
        { name: "Priority Support", included: false },
        { name: "Custom Reports", included: false },
      ],
      pro: [
        { name: "20 Reports Per Month", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Priority Support", included: true },
        { name: "90-Day History", included: true },
        { name: "Video Analysis", included: true },
        { name: "Advanced Metrics", included: true },
        { name: "Performance Trends", included: false },
        { name: "Custom Reports", included: false },
      ],
      elite: [
        { name: "Unlimited Reports", included: true },
        { name: "All Advanced Features", included: true },
        { name: "24/7 Phone Support", included: true },
        { name: "1-Year History", included: true },
        { name: "Dedicated Account Manager", included: true },
        { name: "Custom Integrations", included: true },
        { name: "Performance Trends", included: true },
        { name: "Custom Reports", included: true },
      ],
    };
    return baseFeatures[planId] || baseFeatures.basic;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0E] py-8 px-4 sm:px-6 lg:px-8 landing-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            Select the perfect plan to elevate your football performance
            tracking and analytics
          </p>

          {subscription && (
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-[#262626] border border-[#343434] text-white text-sm font-medium">
              <Award className="w-4 h-4 mr-2 text-primary" />
              Current plan:{" "}
              <span className="font-bold ml-1 capitalize text-primary">
                {subscription.plan_type}
              </span>
              {subscription.status === "active" && (
                <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  Active
                </span>
              )}
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-[#262626] border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full ${
                plan.popular
                  ? "border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                  : isCurrentPlan(plan.id)
                  ? "border-primary/50 shadow-lg shadow-primary/10"
                  : "border-[#343434] hover:border-primary/30"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-linear-to-r from-yellow-500 to-orange-500 text-[#0F0F0E] font-bold px-4 py-1 border-0 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] font-bold px-4 py-1 border-0 shadow-lg">
                    <Check className="w-3 h-3 mr-1" />
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 pt-8">
                {/* Plan Header */}
                <div className="text-center mb-2">
                  <CardTitle className="text-2xl font-bold text-white font-['Orbitron'] mb-3">
                    {plan.name}
                  </CardTitle>

                  {/* Price Section */}
                  <div className="flex items-baseline justify-center mb-3">
                    <span className="text-5xl font-bold text-primary font-['Orbitron']">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-xl text-[#B0AFAF] font-['Orbitron']">
                      /month
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#B0AFAF] text-sm px-4">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-6">
                {/* Features List */}
                <div className="space-y-4 flex-1">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide text-center">
                    What's Included
                  </h4>
                  <ul className="space-y-3">
                    {getPlanFeatures(plan.id).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary mt-0.5 mr-3 shrink-0" />
                        ) : (
                          <div className="h-5 w-5 text-[#B0AFAF] mt-0.5 mr-3 shrink-0 flex items-center justify-center">
                            <div className="h-2 w-2 bg-[#B0AFAF] rounded-full" />
                          </div>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-white"
                              : "text-[#B0AFAF] line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button - Fixed at bottom */}
                <div className="mt-auto pt-4">
                  {isCurrentPlan(plan.id) ? (
                    <Button
                      disabled
                      className="w-full bg-[#343434] text-white border border-[#343434] font-semibold rounded-xl h-12 font-['Orbitron']"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={loading && selectedPlan === plan.id}
                      className={`w-full font-semibold rounded-xl h-12 font-['Orbitron'] transition-all duration-300 ${
                        plan.popular
                          ? "bg-linear-to-r from-yellow-500 to-orange-500 text-[#0F0F0E] hover:from-orange-500 hover:to-yellow-500 shadow-lg shadow-yellow-500/20"
                          : "bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary shadow-lg shadow-primary/20"
                      }`}
                      size="lg"
                    >
                      {loading && selectedPlan === plan.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Get Started
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-[#262626] border-[#343434]">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white font-['Orbitron'] flex items-center justify-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                Plan Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#343434]">
                      <th className="text-left py-4 text-white font-['Orbitron']">
                        Features
                      </th>
                      <th className="text-center py-4">
                        <div className="text-white font-['Orbitron'] font-bold">
                          Basic
                        </div>
                      </th>
                      <th className="text-center py-4">
                        <div className="text-yellow-500 font-['Orbitron'] font-bold">
                          Professional
                        </div>
                      </th>
                      <th className="text-center py-4">
                        <div className="text-purple-500 font-['Orbitron'] font-bold">
                          Elite
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#343434]">
                      <td className="py-4 text-[#B0AFAF] ">Monthly Reports</td>
                      <td className="text-center py-4 text-white ">5</td>
                      <td className="text-center py-4 text-white ">20</td>
                      <td className="text-center py-4 text-white ">
                        Unlimited
                      </td>
                    </tr>
                    <tr className="border-b border-[#343434]">
                      <td className="py-4 text-[#B0AFAF] ">Video Analysis</td>
                      <td className="text-center py-4">
                        <div className="h-2 w-2 bg-[#B0AFAF] rounded-full mx-auto" />
                      </td>
                      <td className="text-center py-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                      <td className="text-center py-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-[#343434]">
                      <td className="py-4 text-[#B0AFAF] ">
                        Advanced Analytics
                      </td>
                      <td className="text-center py-4">
                        <div className="h-2 w-2 bg-[#B0AFAF] rounded-full mx-auto" />
                      </td>
                      <td className="text-center py-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                      <td className="text-center py-4">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-[#343434]">
                      <td className="py-4 text-[#B0AFAF] ">Support</td>
                      <td className="text-center py-4 text-white  text-sm">
                        Email
                      </td>
                      <td className="text-center py-4 text-white  text-sm">
                        Priority
                      </td>
                      <td className="text-center py-4 text-white  text-sm">
                        24/7 Phone
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-[#262626] border-[#343434]">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white font-['Orbitron']">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3 font-['Orbitron']">
                      Can I cancel anytime?
                    </h3>
                    <p className="text-[#B0AFAF] text-sm">
                      Yes, you can cancel your subscription at any time from
                      your account settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-3 font-['Orbitron']">
                      Is there a free trial?
                    </h3>
                    <p className="text-[#B0AFAF] text-sm">
                      We don't offer free trials, but you can start with our
                      Basic plan and upgrade anytime.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3 font-['Orbitron']">
                      What happens after cancellation?
                    </h3>
                    <p className="text-[#B0AFAF] text-sm">
                      You'll retain access until the end of your billing period,
                      then revert to the free plan.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-3 font-['Orbitron']">
                      Need help choosing?
                    </h3>
                    <p className="text-[#B0AFAF] text-sm">
                      Contact our support team for personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
