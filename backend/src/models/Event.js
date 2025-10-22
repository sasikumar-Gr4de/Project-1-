import { supabase } from "../config/supabase.config.js";

export class Event {
  static async create(eventData) {
    const {
      match_id,
      player_id,
      event_number,
      action_name,
      sub_action,
      timestamp,
      seconds,
      minute,
      period,
      position_x,
      position_y,
      position_x_end,
      position_y_end,
      outcome,
      pass_legnth,
      pass_direction,
      body_part,
      shot_type,
      is_cross,
      key_pass,
      assist,
      under_pressure,
      description,
      sepcial_action,
    } = eventData;

    try {
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            match_id,
            player_id,
            event_number,
            action_name,
            sub_action,
            timestamp,
            seconds,
            minute,
            period,
            position_x,
            position_y,
            position_x_end,
            position_y_end,
            outcome,
            pass_legnth,
            pass_direction,
            body_part,
            shot_type,
            is_cross,
            key_pass,
            assist,
            under_pressure,
            description,
            sepcial_action,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("events")
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

  static async findByMatchId(matchId) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("match_id", matchId)
        .order("event_number", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching events by match ID:", err);
      throw err;
    }
  }

  static async findByPlayerId(playerId) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("player_id", playerId)
        .order("event_number", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching events by player ID:", err);
      throw err;
    }
  }

  static async findEventsByMatchIdAndPlayerId(matchId, playerId) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("match_id", matchId)
        .eq("player_id", playerId)
        .order("event_number", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching events by match ID and player ID:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  }
}
