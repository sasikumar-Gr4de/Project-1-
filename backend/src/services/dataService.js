import { supabase } from "../config/supabase.config.js";
import { PLAYER_DATA_STATUS } from "../utils/constants.js";

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

  if (error) {
    console.log(error);
    throw new Error("Failed save player data");
  }

  return {
    ...data,
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

export const triggerAnalaysisModel = async (data) => {
  // const result = await fetch(process.env.ANALYSIS_MODEL_URL + "/analyze", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     ...data,
  //   }),
  // });
  const result = { success: true }; // Mocked result for demonstration

  if (!result.success) {
    throw new Error("Failed to start analysis workflow");
  }

  // Change status to 'processing'
  await changePlayerDataStatus(
    data.player_data_id,
    PLAYER_DATA_STATUS.PROCESSING
  );
};
