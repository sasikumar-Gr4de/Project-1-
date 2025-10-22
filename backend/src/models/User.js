import { supabase } from "../config/supabase.config.js";

class User {
  static async create(userData) {
    const { email, password, full_name, client_type, role, phone_number } =
      userData;
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role, client_type, phone_number },
        },
      });

      if (authError) throw authError;

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            full_name,
            role,
            client_type,
            phone_number,
            is_active: true,
            email_verified: false,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.log("Error creating user:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { id: _, craeted_at, ...safeUpdates } = updateData; // Exclude id and created_at from updates
      const { data, error } = await supabase
        .from("users")
        .update(safeUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.log("Error updating user:", err);
      throw err;
    }
  }

  static async updateLastLogin(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.log("Error updating last login:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination = { page: 1, pageSize: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    try {
      let query = supabase.from("users").select("*", { count: "exact" });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return { data, total: count || 0, page, limit };
    } catch (err) {
      console.log("Error fetching users:", err);
      throw err;
    }
  }

  static async activateUser(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ is_active: true })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.log("Error activating user:", err);
      throw err;
    }
  }

  static async deactivateUser(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.log("Error deactivating user:", err);
      throw err;
    }
  }

  static async getReferenceDataById() {
    try {
      const { data, error } = await supabase
        .from("users")
        .eq("id", id)
        .select("client_type,role,reference_id")
        .single();
      if (error) throw error;
      const { client_type, role, reference_id } = data;
      if (!reference_id) return { client_type, role, reference_data: null };
      let referenceTable = "";
      if (role === "parent" || role === "player") {
        referenceTable = "players";
      } else if (role === "coach") {
        referenceTable = "coaches";
      }

      const { data: reference_data, error: refError } = await supabase
        .from(referenceTable)
        .eq("id", reference_id)
        .select()
        .single();
      if (refError) throw refError;
      return { client_type, role, reference_data };
    } catch (err) {
      console.log("Error fetching user reference data:", err);
      throw err;
    }
  }
}

export default User;
