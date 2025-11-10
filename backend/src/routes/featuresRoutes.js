import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { supabase } from "../config/supabase.config.js";
import { RESPONSES } from "../utils/messages.js";

const router = express.Router();

// All features routes require authentication
router.use(authenticateToken);

/**
 * Get enabled features for current user based on plan and role
 */
router.get("/v1/features", async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    // Get user with tier plan
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("tier_plan")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const userPlan = user.tier_plan || "free";

    // Get all modules
    const { data: allModules, error: modulesError } = await supabase
      .from("feature_modules")
      .select("id, module_name, module_key, description");

    if (modulesError) throw modulesError;

    // Get plan modules for user's plan
    const { data: planModules, error: planError } = await supabase
      .from("plan_module_access")
      .select("module_key")
      .eq("plan", userPlan);

    if (planError) throw planError;

    // Get role modules (force allow/deny) - Note: role_modules table doesn't exist in new schema
    // For now, admins get all access
    const roleModules = role === "admin" ? [] : [];

    // Build features object
    const features = {};

    for (const module of allModules) {
      // Admin role gets all access
      if (role === "admin") {
        features[module.module_key] = { enabled: true, limit: null };
        continue;
      }

      // Check plan-based permissions
      const planModule = planModules.find(
        (pm) => pm.module_key === module.module_key
      );

      if (planModule) {
        features[module.module_key] = {
          enabled: true,
          limit: null, // Unlimited for now, can be extended later
        };
      } else {
        features[module.module_key] = { enabled: false, limit: 0 };
      }
    }

    res.json(
      RESPONSES.SUCCESS("Features retrieved successfully", { features })
    );
  } catch (error) {
    console.error("Get features error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to retrieve features"));
  }
});

export default router;
