import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/contexts/ToastContext";
import {
  CheckCircle,
  ArrowRight,
  Download,
  Zap,
  Crown,
  Star,
} from "lucide-react";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { syncSubscription, subscription } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        await syncSubscription();
        toast({
          title: "Welcome to update your plan!",
          description: " Your subscription is now active.",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to sync subscription:", error);
      }
    };

    initialize();
  }, [syncSubscription, toast]);

  const getPlanIcon = (planType) => {
    switch (planType) {
      case "pro":
        return <Star className="h-8 w-8 text-yellow-500" />;
      case "elite":
        return <Crown className="h-8 w-8 text-purple-500" />;
      default:
        return <Zap className="h-8 w-8 text-blue-500" />;
    }
  };

  const getPlanGradient = (planType) => {
    switch (planType) {
      case "pro":
        return "from-[#60A5FA] to-[#3B82F6]";
      case "elite":
        return "from-[#8B5CF6] to-[#7C3AED]";
      default:
        return "from-primary to-[#94D44A]";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0E] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-[#262626] border-2 border-[#343434] shadow-2xl">
        <CardHeader className="text-center pb-4">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-linear-to-br from-primary to-[#94D44A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-10 w-10 text-[#0F0F0E]" />
          </div>

          <CardTitle className="text-3xl font-bold text-white font-['Orbitron'] mb-2">
            Welcome to Pro!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <p className="text-[#B0AFAF] mb-4 font-['Orbitron']">
              Your subscription has been successfully activated.
            </p>

            {subscription && (
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${getPlanGradient(
                    subscription.plan_type
                  )} flex items-center justify-center shadow-lg`}
                >
                  {getPlanIcon(subscription.plan_type)}
                </div>
                <div className="text-left">
                  <Badge
                    className={`bg-linear-to-br ${getPlanGradient(
                      subscription.plan_type
                    )} text-[#0F0F0E] font-bold border-0`}
                  >
                    {subscription.plan_type.toUpperCase()} PLAN
                  </Badge>
                  <p className="text-white text-sm font-semibold font-['Orbitron'] mt-1">
                    Active Subscription
                  </p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 mb-6 text-left border border-[#343434]">
              <h3 className="font-semibold text-primary mb-3 font-['Orbitron']">
                What's next?
              </h3>
              <ul className="text-sm text-[#B0AFAF] space-y-2">
                <li className="flex items-center">
                  <Zap className="w-4 h-4 text-primary mr-2" />
                  Explore your enhanced dashboard
                </li>
                <li className="flex items-center">
                  <Download className="w-4 h-4 text-primary mr-2" />
                  Upload your first advanced report
                </li>
                <li className="flex items-center">
                  <Crown className="w-4 h-4 text-primary mr-2" />
                  Access premium analytics features
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl h-12 font-['Orbitron']"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              className="w-full bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626] hover:border-primary font-semibold rounded-xl h-12 font-['Orbitron']"
            >
              <Download className="h-4 w-4 mr-2" />
              Upload Reports
            </Button>

            <Button
              onClick={() => navigate("/reports")}
              variant="outline"
              className="w-full bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626] hover:border-primary font-semibold rounded-xl h-12 font-['Orbitron']"
            >
              View Reports
            </Button>
          </div>

          {/* Support Note */}
          <div className="text-center pt-4 border-t border-[#343434]">
            <p className="text-xs text-[#B0AFAF] font-['Orbitron']">
              Need help? Contact our support team anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
