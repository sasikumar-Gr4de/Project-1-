import { supabase } from "../config/supabase.config.js";
import Match from "./Match.js";
import Player from "./Player.js";

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
      const { club_name, location, founded_year, mark_url } = updateData;
      console.log(updateData);
      const { data, error } = await supabase
        .from("clubs")
        .update({
          club_name,
          location,
          founded_year,
          mark_url,
        })
        .eq("club_id", id)
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
    const offset = (page - 1) * pageSize;
    try {
      let query = supabase.from("clubs").select("*", { count: "exact" });
      // Get related matches and players counts for each club
      // home_club_id and away_club_id from matches table
      // club_id from players table
      query = query.select(
        `
        *,
        matches_home:matches!home_club_id (
          match_id
        ),
        matches_away:matches!away_club_id (
          match_id
        ),
        players:players (
          player_id
        )
      `,
        { count: "exact" }
      );

      // Apply filters
      for (const key in filters) {
        if (filters[key]) {
          query = query.eq(key, filters[key]);
        }
      }

      // Get all clubs for selects from query
      if (page === 0 && pageSize === 0) {
        const { data, error } = await query
          .order("created_at", {
            ascending: false,
          })
          .select("club_id, club_name");
        if (error) throw error;
        return { data };
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
        .from("clubs")
        .select("*")
        .eq("club_id", id)
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
      await Match.deleteByClubId(id);
      await Player.deleteByClubId(id);
      const { clubs, error } = await supabase
        .from("clubs")
        .delete()
        .eq("club_id", id)
        .select();

      if (error) throw error_clubs;

      return { success: true };
    } catch (err) {
      console.error("Error deleting club:", err);
      throw err;
    }
  }
}
