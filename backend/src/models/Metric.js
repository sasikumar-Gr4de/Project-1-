import { supabase } from "../config/supabase.config.js";

export class Metric {
  static async logMetric(matchId, playerId, details = {}) {
    const { data, error } = await supabase.from("metrics").insert([
      {
        match_id: matchId,
        player_id: playerId,
        details,
      },
    ]);

    if (error) {
      console.error("Error logging metric:", error);
      return null;
    }

    return data;
  }

  static async getMetricsByMatch(matchId) {
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("match_id", matchId);

    if (error) {
      console.error("Error fetching metrics:", error);
      return null;
    }

    return data;
  }

  static async getMetricsByPlayer(playerId) {
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("player_id", playerId);

    if (error) {
      console.error("Error fetching metrics:", error);
      return null;
    }

    return data;
  }

  static async deleteMetricsByMatch(matchId) {
    const { data, error } = await supabase
      .from("metrics")
      .delete()
      .eq("match_id", matchId);

    if (error) {
      console.error("Error deleting metrics:", error);
      return null;
    }

    return data;
  }

  static async deleteMetricsByPlayer(playerId) {
    const { data, error } = await supabase
      .from("metrics")
      .delete()
      .eq("player_id", playerId);

    if (error) {
      console.error("Error deleting metrics:", error);
      return null;
    }

    return data;
  }
}
