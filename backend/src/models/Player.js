import { supabase } from "../config/supabase.config.js";

import { PLAYER_STATUSES } from "../utils/constants.js";

export default class Player {
  static async create(playerData) {
    const {
      full_name,
      date_of_birth,
      position,
      height_cm,
      weight_kg,
      current_club,
      nationality,
      jersey_number,
    } = playerData;
    try {
      const { data, error } = await supabase
        .from("players")
        .insert([
          {
            full_name,
            date_of_birth,
            position,
            height_cm,
            weight_kg,
            current_club,
            nationality,
            jersey_number,
            status: PLAYER_STATUSES.ACTIVE,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating player:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      // status field validation
      if (
        updateData.status &&
        !Object.values(PLAYER_STATUSES).includes(updateData.status)
      ) {
        throw new Error("Invalid status value");
      }

      const { data, error } = await supabase
        .from("players")
        .update(updateData)
        .eq("player_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating player:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("players").select("*", { count: "exact" });
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
      console.error("Error fetching clubs:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("player_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching player by ID:", err);
      throw err;
    }
  }

  static async findPlayerClubName(playerId) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("current_club ( club_name )")
        .eq("player_id", playerId)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching player's club:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("players")
        .delete()
        .eq("player_id", id)
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting player:", err);
      throw err;
    }
  }
}
