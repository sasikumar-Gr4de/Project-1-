import { supabase } from "../config/supabase.config.js";

export class Player {
  static async create(playerData, createdBy) {
    try {
      const { data, error } = await supabase
        .from("players")
        .insert([
          {
            ...playerData,
            created_by: createdBy,
          },
        ])
        .select(
          `
          *,
          users:created_by(full_name, email)
        `
        )
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating player:", err.message);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select(
          `
          *,
          users:created_by(full_name, email)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error finding player by ID:", err.message);
      throw err;
    }
  }

  static async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    try {
      let query = supabase.from("players").select(
        `
          *,
          users:created_by(full_name, email)
        `,
        { count: "exact" }
      );

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,current_club.ilike.%${filters.search}%`
        );
      }
      if (filters.primary_position) {
        query = query.eq("primary_position", filters.primary_position);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.current_club) {
        query = query.eq("current_club", filters.current_club);
      }
      if (filters.nationality) {
        query = query.eq("nationality", filters.nationality);
      }
      if (filters.min_ability) {
        query = query.gte("overall_ability", filters.min_ability);
      }
      if (filters.max_ability) {
        query = query.lte("overall_ability", filters.max_ability);
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
      console.error("Error finding all players:", err.message);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("players")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          users:created_by(full_name, email)
        `
        )
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating player:", err.message);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase.from("players").delete().eq("id", id);

      if (error) throw error;
      return { success: true, message: "Player deleted successfully" };
    } catch (err) {
      console.error("Error deleting player:", err.message);
      throw err;
    }
  }

  static async getPlayerStats() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("primary_position, status, overall_ability, nationality");

      if (error) throw error;

      const stats = {
        total: data.length,
        byPosition: {},
        byStatus: {},
        byNationality: {},
        averageAbility: 0,
        topPerformers: [],
      };

      let totalAbility = 0;

      data.forEach((player) => {
        // Count by position
        stats.byPosition[player.primary_position] =
          (stats.byPosition[player.primary_position] || 0) + 1;

        // Count by status
        stats.byStatus[player.status] =
          (stats.byStatus[player.status] || 0) + 1;

        // Count by nationality
        stats.byNationality[player.nationality] =
          (stats.byNationality[player.nationality] || 0) + 1;

        // Calculate total ability for average
        if (player.overall_ability) {
          totalAbility += player.overall_ability;
        }
      });

      // Calculate average ability
      stats.averageAbility =
        data.length > 0 ? Math.round(totalAbility / data.length) : 0;

      // Get top 5 performers
      stats.topPerformers = data
        .filter((p) => p.overall_ability)
        .sort((a, b) => b.overall_ability - a.overall_ability)
        .slice(0, 5)
        .map((p) => ({
          name: p.name,
          ability: p.overall_ability,
          position: p.primary_position,
        }));

      return stats;
    } catch (err) {
      console.error("Error getting player stats:", err.message);
      throw err;
    }
  }

  static async getClubs() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("current_club")
        .not("current_club", "is", null);

      if (error) throw error;

      const clubs = [...new Set(data.map((p) => p.current_club))].sort();
      return clubs;
    } catch (err) {
      console.error("Error getting clubs:", err.message);
      throw err;
    }
  }

  static async getNationalities() {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("nationality")
        .not("nationality", "is", null);

      if (error) throw error;

      const nationalities = [...new Set(data.map((p) => p.nationality))].sort();
      return nationalities;
    } catch (err) {
      console.error("Error getting nationalities:", err.message);
      throw err;
    }
  }
}
