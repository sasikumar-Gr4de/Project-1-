import { supabase } from "../config/supabase.config.js";
import { generateUUID } from "./tokenService.js";

export const getOrCreateUser = async (email, phone, userData = {}) => {
  try {
    // Check if user already exists by querying the users table
    const existingUser = await getUserByEmailOrPhone(email, phone);
    if (existingUser) {
      throw new Error("User already registered");
    }
    // Create user profile in users table directly
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          phone: phone || null,
          role: "player",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...userData,
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    return {
      user: profile, // Return the profile as user object
      isNewUser: true,
    };
  } catch (err) {
    console.error("Create user error:", err);
    throw new Error(`User creation failed: ${err.message}`);
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

const getUserByEmailOrPhone = async (email, phone) => {
  let query = supabase.from("users").select("*");

  if (email) {
    query = query.or(`email.eq.${email}`);
  }

  if (phone) {
    query = query.or(email ? `phone.eq.${phone}` : `phone.eq.${phone}`);
  }

  const { data, error } = await query.maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows
    console.error("Error finding user:", error);
    return null;
  }
  console.log("User found by email/phone:", data);

  return data;
};
