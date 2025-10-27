import { supabase } from "../config/supabase.config.js";

export default class EventTemp {
  static async create(eventData) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .insert([eventData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  }

  static async createBulk(eventsData) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .insert(eventsData)
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating bulk events:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating event:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("events_temp").select(
        `
          *,
          matches (*),
          players (*)
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
        .order("timestamp", { ascending: true });
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
      console.error("Error fetching events:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .select(
          `
          *,
          matches (*),
          players (*)
        `
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching event by ID:", err);
      throw err;
    }
  }

  static async findByMatchId(matchId, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      const { data, error, count } = await supabase
        .from("events_temp")
        .select(
          `
          *,
          players (*)
        `,
          { count: "exact" }
        )
        .eq("match_id", matchId)
        .range(offset, offset + pageSize - 1)
        .order("timestamp", { ascending: true });
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
      console.error("Error fetching events by match ID:", err);
      throw err;
    }
  }

  static async findByPlayerId(playerId, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      const { data, error, count } = await supabase
        .from("events_temp")
        .select(
          `
          *,
          matches (*)
        `,
          { count: "exact" }
        )
        .eq("player_id", playerId)
        .range(offset, offset + pageSize - 1)
        .order("timestamp", { ascending: true });
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
      console.error("Error fetching events by player ID:", err);
      throw err;
    }
  }

  static async findByMatchAndPlayer(matchId, playerId) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .select(
          `
          *,
          matches (*),
          players (*)
        `
        )
        .eq("match_id", matchId)
        .eq("player_id", playerId)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching events by match and player:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  }

  static async deleteByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("events_temp")
        .delete()
        .eq("match_id", matchId)
        .select();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error deleting events by match ID:", err);
      throw err;
    }
  }
}
