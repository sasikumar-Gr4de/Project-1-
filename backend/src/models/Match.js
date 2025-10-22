import { supabase } from "../config/supabase.config.js";
import { MATCH_STATUSES } from "../utils/constants.js";

export class Match {
  static async create(matchData) {
    const {
      home_team,
      away_team,
      match_date,
      venue,
      competition,
      score_home,
      score_away,
      duration_minutes,
      video_url,
      match_status = MATCH_STATUSES.SCHEDULED,
    } = matchData;
    try {
      const { data, error } = await supabase
        .from("matches")
        .insert([
          {
            home_team,
            away_team,
            match_date,
            venue,
            competition,
            score_home,
            score_away,
            duration_minutes,
            video_url,
            match_status,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating match:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      // status field validation
      if (
        updateData.status &&
        !Object.values(MATCH_STATUSES).includes(updateData.status)
      ) {
        throw new Error("Invalid status value");
      }

      const { data, error } = await supabase
        .from("matches")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating match:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination = { page: 1, pageSize: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    try {
      let query = supabase.from("matches").select("*", { count: "exact" });

      // Apply filters
      for (const key in filters) {
        if (filters[key]) {
          query = query.eq(key, filters[key]);
        }
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("match_date", { ascending: false });
      if (error) throw error;

      return {
        data,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (err) {
      console.error("Error fetching matches:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching match by ID:", err);
      throw err;
    }
  }

  static async findByClubId(clubId, pagination = { page: 1, pageSize: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    try {
      let query = supabase
        .from("matches")
        .select("*", { count: "exact" })
        .or(`home_team.eq.${clubId},away_team.eq.${clubId}`);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("match_date", { ascending: false });
      if (error) throw error;

      return {
        data,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (err) {
      console.error("Error fetching matches by club ID:", err);
      throw err;
    }
  }

  static async findByPlayerId(
    playerId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    try {
      // First, fetch the player's club ID
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("club_id")
        .eq("id", playerId)
        .single();
      if (playerError) throw playerError;

      const clubId = player.club_id;

      // Now fetch matches for that club
      let query = supabase
        .from("matches")
        .select("*", { count: "exact" })
        .or(`home_team.eq.${clubId},away_team.eq.${clubId}`);

      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order("match_date", { ascending: false });
      if (error) throw error;

      return {
        data,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (err) {
      console.error("Error fetching matches by player ID:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("matches")
        .delete()
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting match:", err);
      throw err;
    }
  }
}
