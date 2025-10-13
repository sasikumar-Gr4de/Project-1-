import { supabase } from "../config/supabase";
import bcrypt from "bcryptjs";

export class User {
  static async create(userData) {
    const {
      email,
      password,
      full_name,
      role,
      client_type,
      organization,
      phone_number,
    } = userData;

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role, client_type, organization, phone_number },
        },
      });

      if (authError) throw authError;

      // Create user profile in our database
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            full_name,
            role,
            client_type,
            organization,
            phone_number,
            is_active: true,
          },
        ])
        .select(
          `
          id,
          email,
          full_name,
          role,
          client_type,
          organization,
          phone_number,
          avatar_url,
          is_active,
          email_verified,
          last_login,
          created_at,
          updated_at
        `
        )
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating user:", err.message);
      throw err;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error finding user by email:", err.message);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error finding user by ID:", err.message);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, created_at, ...safeUpdates } = updates;
      const { data, error } = await supabase
        .from("users")
        .update(safeUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating user:", err.message);
      throw err;
    }
  }
}
