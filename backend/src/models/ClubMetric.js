import { match } from "assert";
import { supabase } from "../config/supabase.config";

export class ClubMetric {
  static async logClubMetric(clubId, matchId, details = {}) {
    const { data, error } = await supabase.from("club_metrics").insert([
      {
        club_id: clubId,
        match_id: matchId,
        details,
      },
    ]);
    if (error) {
      console.error("Error logging club metric:", error);
      return null;
    }
    return data;
  }

  static async getClubMetricsByClub(clubId) {
    const { data, error } = await supabase
      .from("club_metrics")
      .select("*")
      .eq("club_id", clubId);

    if (error) {
      console.error("Error fetching club metrics:", error);
      return null;
    }

    return data;
  }

  static async getClubMetricsByMatch(matchId) {
    const { data, error } = await supabase
      .from("club_metrics")
      .select("*")
      .eq("match_id", matchId);

    if (error) {
      console.error("Error fetching club metrics:", error);
      return null;
    }

    return data;
  }

  static async deleteClubMetricsByMatch(matchId) {
    const { data, error } = await supabase
      .from("club_metrics")
      .delete()
      .eq("match_id", matchId);

    if (error) {
      console.error("Error deleting club metrics:", error);
      return null;
    }

    return data;
  }

  static async deleteClubMetricsByClub(clubId) {
    const { data, error } = await supabase
      .from("club_metrics")
      .delete()
      .eq("club_id", clubId);

    if (error) {
      console.error("Error deleting club metrics:", error);
      return null;
    }

    return data;
  }
}
