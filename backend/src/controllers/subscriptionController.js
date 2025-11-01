import stripe from "../config/stripe.config.js";
import { RESPONSES } from "../utils/messages.js";
import { supabase } from "../config/supabase.config.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json(RESPONSES.ERROR("Price ID is required"));
    }

    // Validate price ID
    const validPriceIds = [
      process.env.STRIPE_BASIC_PRICE_ID,
      process.env.STRIPE_PRO_PRICE_ID,
      process.env.STRIPE_ELITE_PRICE_ID,
    ];

    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json(RESPONSES.ERROR("Invalid price ID"));
    }

    // Get or create Stripe customer
    let customerId = req.user.stripe_customer_id;
    console.log(customerId);
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id,
        },
      });
      console.log(customer);
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from("users")
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        successUrl ||
        `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/subscription`,
      customer: customerId,
      metadata: {
        userId: req.user.id,
      },
    });

    res.json(
      RESPONSES.SUCCESS("Checkout session created", {
        sessionId: session.id,
        url: session.url,
      })
    );
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Payment processing failed"));
  }
};

/**
 * Create customer portal session
 */
export const createPortalSession = async (req, res) => {
  try {
    const user = req.user;

    if (!user.stripe_customer_id) {
      return res.status(400).json(RESPONSES.ERROR("No subscription found"));
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/profile`,
    });

    res.json(
      RESPONSES.SUCCESS("Portal session created", {
        url: session.url,
      })
    );
  } catch (error) {
    console.error("Create portal session error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to create portal session"));
  }
};

/**
 * Get current user subscription
 */
export const getSubscription = async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    res.json(RESPONSES.SUCCESS("Subscription fetched", subscription || null));
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to get subscription"));
  }
};

/**
 * Get subscription plans
 */
export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: "basic",
        name: "Basic",
        price: "€99",
        priceId: process.env.STRIPE_BASIC_PRICE_ID,
        description: "Perfect for getting started",
        features: [
          "5 reports per month",
          "Basic analytics",
          "Email support",
          "30-day history",
        ],
        limits: {
          monthlyReports: 5,
          historyDays: 30,
          support: "email",
        },
      },
      {
        id: "pro",
        name: "Professional",
        price: "€299",
        priceId: process.env.STRIPE_PRO_PRICE_ID,
        description: "For serious athletes",
        features: [
          "20 reports per month",
          "Advanced analytics",
          "Priority support",
          "90-day history",
          "Video analysis",
        ],
        limits: {
          monthlyReports: 20,
          historyDays: 90,
          support: "priority",
        },
        popular: true,
      },
      {
        id: "elite",
        name: "Elite",
        price: "€499",
        priceId: process.env.STRIPE_ELITE_PRICE_ID,
        description: "Maximum performance tracking",
        features: [
          "Unlimited reports",
          "All advanced features",
          "24/7 phone support",
          "1-year history",
          "Dedicated account manager",
          "Custom integrations",
        ],
        limits: {
          monthlyReports: -1, // unlimited
          historyDays: 365,
          support: "24/7",
        },
      },
    ];

    res.json(RESPONSES.SUCCESS("Plans fetched", plans));
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to get plans"));
  }
};

/**
 * Check feature access
 */
export const checkAccess = async (req, res) => {
  try {
    const { feature } = req.body;
    const userId = req.user.id;

    if (!feature) {
      return res.status(400).json(RESPONSES.ERROR("Feature name is required"));
    }

    // Get user's current subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const hasAccess = checkFeatureAccess(subscription, feature);

    res.json(
      RESPONSES.SUCCESS("Access checked", {
        hasAccess,
        subscription: subscription?.plan_type || "free",
        reason: hasAccess ? null : getAccessReason(subscription, feature),
      })
    );
  } catch (error) {
    console.error("Check access error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to check access"));
  }
};

/**
 * Sync subscription with Stripe
 */
export const syncSubscription = async (req, res) => {
  try {
    const user = req.user;

    if (!user.stripe_customer_id) {
      return res.json(RESPONSES.SUCCESS("No subscription found", null));
    }

    // Get latest subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: "all",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No subscription found, update local DB
      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("status", "active");

      await supabase
        .from("users")
        .update({
          tier_plan: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return res.json(RESPONSES.SUCCESS("Subscription synced", null));
    }

    const stripeSubscription = subscriptions.data[0];
    await handleSubscriptionUpdate(stripeSubscription);

    // Get updated subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    res.json(RESPONSES.SUCCESS("Subscription synced", subscription));
  } catch (error) {
    console.error("Sync subscription error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to sync subscription"));
  }
};

// Webhook handler (keep your existing)
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        await handleSubscriptionCancel(deletedSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Webhook handler failed"));
  }
};

// Helper functions
async function handleSubscriptionUpdate(subscription) {
  const { data: existing, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  const subscriptionData = {
    user_id: subscription.metadata?.userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    plan_type: mapPriceToPlan(subscription.items.data[0].price.id),
    status: subscription.status,
    current_period_start: new Date(
      subscription.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    console.log("existing subscription", subscriptionData);
    await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existing.id);
  } else {
    subscriptionData.created_at = new Date().toISOString();
    console.log("new subscription", subscriptionData);
    await supabase.from("subscriptions").insert(subscriptionData);
  }

  // Update user tier if subscription is active
  if (subscription.status === "active") {
    await supabase
      .from("users")
      .update({
        tier_plan: subscriptionData.plan_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.metadata?.userId);
  }
}

async function handleSubscriptionCancel(subscription) {
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  // Downgrade user to free tier
  await supabase
    .from("users")
    .update({
      tier_plan: "free",
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscription.metadata?.userId);
}

function mapPriceToPlan(priceId) {
  const priceMap = {
    [process.env.STRIPE_BASIC_PRICE_ID]: "basic",
    [process.env.STRIPE_PRO_PRICE_ID]: "pro",
    [process.env.STRIPE_ELITE_PRICE_ID]: "elite",
  };

  return priceMap[priceId] || "basic";
}

function checkFeatureAccess(subscription, feature) {
  if (!subscription || subscription.status !== "active") {
    return false;
  }

  const featureMatrix = {
    basic: ["basic_reports", "email_support", "dashboard_basic"],
    pro: [
      "basic_reports",
      "advanced_reports",
      "priority_support",
      "video_analysis",
      "dashboard_advanced",
    ],
    elite: [
      "all_features",
      "unlimited_reports",
      "phone_support",
      "dedicated_manager",
    ],
  };

  const planFeatures = featureMatrix[subscription.plan_type] || [];
  return (
    planFeatures.includes("all_features") || planFeatures.includes(feature)
  );
}

function getAccessReason(subscription, feature) {
  if (!subscription) return "No active subscription";
  if (subscription.status !== "active") return "Subscription not active";
  return `Feature "${feature}" not available in ${subscription.plan_type} plan`;
}
