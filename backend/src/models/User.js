import { supabase } from "../config/supabase.js";
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
        .maybeSingle();
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
        .maybeSingle();
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

  static async updateLastLogin(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", id)
        .select("last_login")
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating last login:", err.message);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    try {
      let query = supabase.from("users").select("*", { count: "exact" });

      // Apply filters
      if (filters.role) {
        query = query.eq("role", filters.role);
      }

      if (filters.search) {
        query = query.or(
          `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`
        );
      }
      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return {
        data,
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > offset + limit,
      };
    } catch (err) {
      console.error("Error finding all users:", err.message);
      throw err;
    }
  }
  static async deactivateUser(id) {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async activateUser(id) {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUsersStats() {
    const { data, error } = await supabase
      .from("users")
      .select("role, is_active");

    if (error) throw error;

    const stats = {
      total: data.length,
      byRole: {},
      active: data.filter((user) => user.is_active).length,
      inactive: data.filter((user) => !user.is_active).length,
    };

    data.forEach((user) => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    return stats;
  }
}
