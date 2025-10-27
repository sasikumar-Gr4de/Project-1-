import { supabase } from "../config/supabase.config.js";

export default class AnalysisWork {
  static async create(analysisWorkData) {
    const { match_id, tagged_by, progress, rating, status, notes } =
      analysisWorkData;
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .insert([{ match_id, tagged_by, progress, rating, status, notes }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating analysis work:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .update(updateData)
        .eq("analysis_work_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating analysis work:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("analysis_works").select(
        `
          *,
          matches (*),
          users (*)
        `,
        { count: "exact" }
      );

      // Apply filters
      for (const key in filters) {
        if (filters[key]) {
          query = query.eq(key, filters[key]);
        }
      }

      const { data, error, count } = await query
        .range(offset, offset + pageSize - 1)
        .order("created_at", { ascending: false });
      if (error) throw error;

      return {
        data,
        pagination: {
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize) || 0,
        },
      };
    } catch (err) {
      console.error("Error fetching analysis works:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .select(
          `
          *,
          matches (*),
          users (*)
        `
        )
        .eq("analysis_work_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching analysis work by ID:", err);
      throw err;
    }
  }

  static async findByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .select(
          `
          *,
          matches (*),
          users (*)
        `
        )
        .eq("match_id", matchId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching analysis work by match ID:", err);
      throw err;
    }
  }

  static async findByUserId(userId, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      const { data, error, count } = await supabase
        .from("analysis_works")
        .select(
          `
          *,
          matches (*)
        `,
          { count: "exact" }
        )
        .eq("tagged_by", userId)
        .range(offset, offset + pageSize - 1)
        .order("created_at", { ascending: false });
      if (error) throw error;

      return {
        data,
        pagination: {
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize) || 0,
        },
      };
    } catch (err) {
      console.error("Error fetching analysis works by user ID:", err);
      throw err;
    }
  }

  static async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .update({ status })
        .eq("analysis_work_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating analysis work status:", err);
      throw err;
    }
  }

  static async updateProgress(id, progress) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .update({ progress })
        .eq("analysis_work_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating analysis work progress:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("analysis_works")
        .delete()
        .eq("analysis_work_id", id)
        .select();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error deleting analysis work:", err);
      throw err;
    }
  }
}
