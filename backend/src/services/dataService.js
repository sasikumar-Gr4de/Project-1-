import { supabase } from "../config/supabase.config.js";
import { PLAYER_DATA_STATUS, QUEUE_STATUS } from "../utils/constants.js";

export const createPlayerData = async (userId, playerData) => {
  const { match_date, video_url, gps_url, metadata } = playerData;

  const { data, error } = await supabase
    .from("player_data")
    .insert([
      {
        player_id: userId,
        video_url: video_url,
        gps_url: gps_url,
        match_date: match_date,
        metadata,
        status: PLAYER_DATA_STATUS.UPLOADED, // Set initial status to "uploaded"
      },
    ])
    .select()
    .single();

  const { id } = data;
  const { data: queueData, error: queueError } = await supabase
    .from("processing_queue")
    .insert({
      player_data_id: id,
      status: QUEUE_STATUS.PENDING,
      logs: "Queue created for player data",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  const { id: queueId } = queueData;

  if (error || queueError) {
    console.log(error);
    throw new Error("Failed save player data");
  }

  return {
    ...data,
    queue_id: queueId,
  };
};

export const changePlayerDataStatus = async (dataId, status) => {
  const { data, error } = await supabase
    .from("player_data")
    .update({ status })
    .eq("id", dataId)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update player data status");
  }

  return data;
};

export const getPlayerDataById = async (dataId) => {
  const { data, error } = await supabase
    .from("player_data")
    .select("*")
    .eq("id", dataId)
    .single();

  if (error) {
    throw new Error("Failed to fetch player data");
  }

  return data;
};

export const getAllPlayerDataByPlayerId = async (
  playerId,
  { page = 1, limit = 10 }
) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  const { data, error } = await supabase
    .from("player_data")
    .select("*", { count: "exact" })
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw new Error("Failed to fetch player data");

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};

export const updateQueueData = async (queueId, data) => {
  const { data, error } = await supabase
    .from("processing_queue")
    .update(data)
    .eq("id", queueId)
    .select()
    .single();

  if (error) throw new Error("Failed to update queue data");
  return data;
};
