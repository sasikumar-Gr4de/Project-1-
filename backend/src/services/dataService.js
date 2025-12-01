import { supabase } from "../config/supabase.config.js";
import { createQueue } from "../services/queueService.js";
import { PLAYER_DATA_STATUS, QUEUE_STATUS } from "../utils/constants.js";
import axios from "axios"; // for model server request

// Create player data
export const createPlayerData = async (userId, data) => {
  try {
    const { match_date, video_url, gps_url, metadata } = data;
    const { data: playerData, error: playerDataError } = await supabase
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

    if (playerDataError) throw playerDataError;

    // Create queue
    const { id: jobId } = await createQueue({
      player_data_id: playerData.id,
      status: QUEUE_STATUS.PENDING,
      logs: "Queue created for player data",
      created_at: new Date().toISOString(),
    });

    // Return player data with job_id
    return { ...playerData, job_id: jobId };
  } catch (error) {
    console.log("Create player data error:", error);
    throw new Error("Failed to create player data");
  }
};

// Change player data status
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

// Get player data by id
export const getPlayerDataById = async (dataId) => {
  const { data, error } = await supabase
    .from("player_data")
    .select("*")
    .eq("id", dataId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch player data");
  }

  return data;
};

// Get all player data by player id
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

// Trigger analysis model service
export const triggerAnalaysisModel = async (data) => {
  // Destructure data
  const { player_data_id, video_url, gps_url, metadata } = data;
  try {
    // Send request to model server
    const response = await axios.post(
      `${process.env.ANALYSIS_MODEL_URL}/analyze`,
      data
    );
    return response.data;
  } catch (error) {
    // console.log("Trigger analysis model error:", error);
    throw new Error("Failed to trigger analysis model");
  }
};
