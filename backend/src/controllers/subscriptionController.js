import stripe from "../config/stripe.config.js";
import { RESPONSES, SUBSCRIPTION_MESSAGES } from "../utils/messages.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Create Stripe checkout session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: req.user.email, // Pre-fill email
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
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(SUBSCRIPTION_MESSAGES.PAYMENT_FAILED));
  }
};

/**
 * Handle Stripe webhooks
 */
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

/**
 * Get current user subscription
 */
export const getSubscription = async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows
      throw error;
    }

    res.json(RESPONSES.SUCCESS("Subscription fetched", subscription || null));
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to get subscription"));
  }
};

// Helper functions for webhook handling
async function handleSubscriptionUpdate(subscription) {
  const { data: existing, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  const subscriptionData = {
    user_id: subscription.metadata.userId,
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
    await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existing.id);
  } else {
    await supabase.from("subscriptions").insert(subscriptionData);
  }

  // Update user tier
  await supabase
    .from("users")
    .update({
      tier_plan: subscriptionData.plan_type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", subscription.metadata.userId);
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
    .eq("id", subscription.metadata.userId);
}

function mapPriceToPlan(priceId) {
  // Map Stripe price IDs to your plan types
  const priceMap = {
    price_basic: "basic",
    price_pro: "pro",
    price_elite: "elite",
  };

  return priceMap[priceId] || "basic";
}
