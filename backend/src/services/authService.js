import { supabase } from "../config/supabase.config.js";

export const createUser = async (email, password, userData = {}) => {
  try {
    let authData;

    if (email) {
      const { data, error } = await supabase.auth.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          ...userData,
        },
      });
      if (error) {
        if (error.message === "User already registered") {
          const { data: existinguser } =
            await supabase.auth.admin.getUserByEmail(email);
          authData = existinguser;
        } else {
          throw new Error(error.message);
        }
      } else {
        authData = data;
      }
    }

    // Create user profile in users table
    if (authData && authData.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          ...userData,
        },
      ]);
      if (profileError) {
        await supabase;
        throw profileError;
      }
    }
  } catch (err) {
    throw new Error("User creation failed: " + err.message);
  }
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Failed to fetch user profile");
  }

  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update user profile");
  }
  return data;
};
