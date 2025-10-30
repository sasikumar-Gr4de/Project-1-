import { supabase } from "../config/supabase.config.js";

export const createUser = async (email, phone, userData = {}) => {
  const session = await supabase.client.auth.getSession();

  try {
    // Check if user already exists
    const existingUser = await findUserByEmailOrPhone(email, phone);
    if (existingUser) {
      throw new Error("User already registered");
    }

    // Create auth user
    const authUser = await createAuthUser(email, userData);

    // Create user profile
    const userProfile = await createUserProfile(authUser, phone, userData);

    return {
      id: authUser.id,
      email: authUser.email,
      ...userProfile,
    };
  } catch (error) {
    console.error("Create user error:", error);

    // Cleanup on failure
    if (error.message.includes("profile") && authUser) {
      await supabase.auth.admin.deleteUser(authUser.id);
    }

    throw new Error(`User creation failed: ${error.message}`);
  }
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      throw new Error("User profile not found");
    }
    throw new Error("Failed to fetch user profile");
  }

  return data;
};

export const updateUserProfile = async (userId, updates) => {
  // Validate updates
  const allowedFields = [
    "player_name",
    "date_of_birth",
    "position",
    "academy",
    "country",
    "avatar_url",
    "bio",
  ];
  const filteredUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new Error("No valid fields to update");
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      ...filteredUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return data;
};

export const completeOnboarding = async (userId, onboardingData) => {
  const requiredFields = ["player_name", "date_of_birth", "position"];
  const missingFields = requiredFields.filter(
    (field) => !onboardingData[field]
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  return await updateUserProfile(userId, onboardingData);
};

// Helper functions
const findUserByEmailOrPhone = async (email, phone) => {
  if (email) {
    const { data, error } = await supabase.auth.admin.getUserByEmail(email);
    if (!error && data) return data.user;
  }

  // Implement phone-based lookup if needed
  if (phone) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (!error && data) return data;
  }

  return null;
};

const createAuthUser = async (email, userData) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      ...userData,
    },
  });

  if (error) {
    throw new Error(`Auth user creation failed: ${error.message}`);
  }

  return data.user;
};

const createUserProfile = async (authUser, phone, userData) => {
  const { error } = await supabase.from("users").insert([
    {
      id: authUser.id,
      email: authUser.email,
      phone: phone || null,
      role: "player", // Default role
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...userData,
    },
  ]);

  if (error) {
    throw new Error(`Profile creation failed: ${error.message}`);
  }

  // Return the created profile
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  return data;
};
