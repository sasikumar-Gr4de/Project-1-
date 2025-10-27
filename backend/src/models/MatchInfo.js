import { supabase } from "../config/supabase.config.js";

export default class MatchInfo {
  static async create(matchInfoData) {
    const { match_id, club_id, player_id, position, start_time, end_time } =
      matchInfoData;
    try {
      const { data, error } = await supabase
        .from("match_info")
        .insert([
          { match_id, club_id, player_id, position, start_time, end_time },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating match info:", err);
      throw err;
    }
  }

  static async createBulk(matchInfoArray) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .insert(matchInfoArray)
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating bulk match info:", err);
      throw err;
    }
  }

  static async deleteByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .delete()
        .eq("match_id", matchId)
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting match info by match ID:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .update(updateData)
        .eq("match_info_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating match info:", err);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("match_info").select(
        `
          *,
          matches (*),
          clubs (*),
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
        .order("start_time", { ascending: true });
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
      console.error("Error fetching match info:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .select(
          `
          *,
          matches (*),
          clubs (*),
          players (*)
        `
        )
        .eq("match_info_id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching match info by ID:", err);
      throw err;
    }
  }

  static async findByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .select(
          `
          *,
          clubs (*),
          players (*)
        `
        )
        .eq("match_id", matchId)
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching match info by match ID:", err);
      throw err;
    }
  }

  static async findByClubId(clubId, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      const { data, error, count } = await supabase
        .from("match_info")
        .select(
          `
          *,
          matches (*),
          players (*)
        `,
          { count: "exact" }
        )
        .eq("club_id", clubId)
        .range(offset, offset + pageSize - 1)
        .order("start_time", { ascending: false });
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
      console.error("Error fetching match info by club ID:", err);
      throw err;
    }
  }

  static async findByPlayerId(playerId, pagination) {
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;
    try {
      const { data, error, count } = await supabase
        .from("match_info")
        .select(
          `
          *,
          matches (*),
          clubs (*)
        `,
          { count: "exact" }
        )
        .eq("player_id", playerId)
        .range(offset, offset + pageSize - 1)
        .order("start_time", { ascending: false });
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
      console.error("Error fetching match info by player ID:", err);
      throw err;
    }
  }

  static async findLineupByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .select(
          `
          *,
          players (*),
          clubs (*)
        `
        )
        .eq("match_id", matchId)
        .order("position", { ascending: true });
      if (error) throw error;

      // Group by club for lineup structure
      const lineup = data.reduce((acc, item) => {
        const clubId = item.club_id;
        if (!acc[clubId]) {
          acc[clubId] = {
            club: item.clubs,
            players: [],
          };
        }
        acc[clubId].players.push({
          match_info_id: item.match_info_id,
          player: item.players,
          position: item.position,
          start_time: item.start_time,
          end_time: item.end_time,
        });
        return acc;
      }, {});

      return lineup;
    } catch (err) {
      console.error("Error fetching match lineup:", err);
      throw err;
    }
  }

  static async updateEndTime(id, endTime) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .update({ end_time: endTime })
        .eq("match_info_id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating player end time:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("match_info")
        .delete()
        .eq("match_info_id", id)
        .select();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error deleting match info:", err);
      throw err;
    }
  }
}
