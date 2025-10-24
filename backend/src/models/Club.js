import { supabase } from "../config/supabase.config.js";

export default class Club {
  static async create(clubData) {
    const { club_name, location, founded_year, mark_url } = clubData;
    try {
      const { data, error } = await supabase
        .from("clubs")
        .insert([{ club_name, location, founded_year, mark_url }])
        .select()
        .single();
      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error creating club:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating club:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination) {
    const { page, pageSize } = pagination;
    console.log(pagination);
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("clubs").select("*", { count: "exact" });

      // Apply filters
      for (const key in filters) {
        if (filters[key]) {
          query = query.eq(key, filters[key]);
        }
      }
      console.log(offset, offset + pageSize - 1);
      const { data, error, count } = await query
        .range(offset, offset + pageSize - 1)
        .order("created_at", { ascending: false });
      console.log(data);
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
      console.error("Error fetching clubs:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching club by ID:", err);
      throw err;
    }
  }

  static async findClubPlayers(clubId) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("club_id", clubId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching club players:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data_clubs, error_clubs } = await supabase
        .from("clubs")
        .delete()
        .eq("id", id)
        .select();

      if (error_clubs) throw error_clubs;
      const { data_players, error_players } = await supabase
        .from("players")
        .update("is_active", false)
        .eq("club_id", id)
        .select();
      if (error_players) throw error_players;
      return { success: true };
    } catch (err) {
      console.error("Error deleting club:", err);
      throw err;
    }
  }
}
