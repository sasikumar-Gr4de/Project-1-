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
      .from("modules")
      .select("id, name, key, description");

    if (modulesError) throw modulesError;

    // Get plan modules for user's plan
    const { data: planModules, error: planError } = await supabase
      .from("plan_modules")
      .select(
        `
        module_id,
        limit_value,
        plans!inner(key)
      `
      )
      .eq("plans.key", userPlan);

    if (planError) throw planError;

    // Get role modules (force allow/deny)
    const { data: roleModules, error: roleError } = await supabase
      .from("role_modules")
      .select("module_id, force_allow, force_deny")
      .eq("role", role);

    if (roleError) throw roleError;

    // Build features object
    const features = {};

    for (const module of allModules) {
      // Check role-based permissions first
      const roleModule = roleModules.find((rm) => rm.module_id === module.id);

      if (roleModule?.force_deny) {
        features[module.key] = { enabled: false, limit: 0 };
        continue;
      }

      if (roleModule?.force_allow) {
        features[module.key] = { enabled: true, limit: null };
        continue;
      }

      // Check plan-based permissions
      const planModule = planModules.find((pm) => pm.module_id === module.id);

      if (planModule) {
        features[module.key] = {
          enabled: true,
          limit: planModule.limit_value,
        };
      } else {
        features[module.key] = { enabled: false, limit: 0 };
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
