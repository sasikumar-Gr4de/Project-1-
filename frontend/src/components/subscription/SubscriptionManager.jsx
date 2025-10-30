import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { subscriptionService } from "@/services/subscription.service";
import { useToast } from "@/contexts/ToastContext";
import {
  ExternalLink,
  Calendar,
  CreditCard,
  RefreshCw,
  Crown,
  Star,
  Zap,
  AlertTriangle,
} from "lucide-react";

const SubscriptionManager = () => {
  const { subscription, syncSubscription } = useUserStore();
  const { showToast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const response = await subscriptionService.createPortalSession();
      window.location.href = response.data.url;
    } catch (error) {
      showToast("Failed to open customer portal", "error");
    }
  };

  const handleSyncSubscription = async () => {
    try {
      await syncSubscription();
      showToast("Subscription synced successfully", "success");
    } catch (error) {
      showToast("Failed to sync subscription", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanIcon = (planType) => {
    switch (planType) {
      case "pro":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "elite":
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return <Zap className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "past_due":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-[#343434] text-[#B0AFAF] border-[#343434]";
    }
  };

  if (!subscription) {
    return (
      <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white font-['Orbitron'] flex items-center">
            <Crown className="w-5 h-5 mr-2 text-primary" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#B0AFAF] mb-2 font-['Orbitron']">
                You're currently on the free plan.
              </p>
              <Badge
                variant="outline"
                className="bg-[#343434] text-[#B0AFAF] border-[#343434] font-['Orbitron']"
              >
                FREE TIER
              </Badge>
            </div>
            <Button
              onClick={() => (window.location.href = "/subscription")}
              className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl font-['Orbitron']"
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === "active";

  return (
    <Card className="bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white font-['Orbitron'] flex items-center">
            {getPlanIcon(subscription.plan_type)}
            <span className="ml-2">Your Subscription</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncSubscription}
            className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626] hover:border-primary font-['Orbitron']"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan & Status */}
        <div className="flex justify-between items-center">
          <span className="text-[#B0AFAF] font-['Orbitron']">Plan</span>
          <div className="flex items-center space-x-2">
            <Badge className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] font-bold border-0 font-['Orbitron']">
              {subscription.plan_type.toUpperCase()}
            </Badge>
            <Badge
              className={`${getStatusColor(
                subscription.status
              )} font-['Orbitron']`}
            >
              {subscription.status}
            </Badge>
          </div>
        </div>

        {/* Billing Period */}
        {subscription.current_period_start &&
          subscription.current_period_end && (
            <div className="flex justify-between items-center">
              <span className="text-[#B0AFAF] flex items-center font-['Orbitron']">
                <Calendar className="h-4 w-4 mr-2" />
                Billing Period
              </span>
              <span className="font-semibold text-white text-sm text-right font-['Orbitron']">
                {formatDate(subscription.current_period_start)} -{" "}
                {formatDate(subscription.current_period_end)}
              </span>
            </div>
          )}

        {/* Subscription ID */}
        {subscription.stripe_subscription_id && (
          <div className="flex justify-between items-center">
            <span className="text-[#B0AFAF] font-['Orbitron']">
              Subscription ID
            </span>
            <span className="text-xs text-[#B0AFAF] font-['Orbitron']">
              {subscription.stripe_subscription_id.slice(-8)}
            </span>
          </div>
        )}

        {/* Manage Subscription Button */}
        <Button
          onClick={handleManageSubscription}
          variant="outline"
          className="w-full bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626] hover:border-primary font-semibold rounded-xl font-['Orbitron']"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Manage Subscription
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>

        {/* Status Message */}
        {!isActive && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <p className="text-yellow-400 text-sm font-['Orbitron']">
                Your subscription is not active. Please check your payment
                method or contact support.
              </p>
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Basic/Pro */}
        {isActive && subscription.plan_type !== "elite" && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary text-sm font-semibold font-['Orbitron']">
                  Ready for more features?
                </p>
                <p className="text-primary/80 text-xs font-['Orbitron']">
                  Upgrade to unlock advanced analytics
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/subscription")}
                className="bg-primary text-[#0F0F0E] hover:bg-[#94D44A] font-semibold font-['Orbitron']"
              >
                Upgrade
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
