import { supabase } from "../config/supabase.config.js";

export const createQueue = async (data) => {
  const { data: queueData, error: queueError } = await supabase
    .from("processing_queue")
    .insert(data)
    .select()
    .single();

  if (queueError) throw queueError;
  return queueData;
};

export const getQueueById = async (queueId) => {
  const { data, error } = await supabase
    .from("processing_queue")
    .select("*")
    .eq("id", queueId)
    .single();

  if (error) throw error;
  return data;
};

export const updateQueueData = async (player_data_id, data) => {
  const { data: queueData, error: queueError } = await supabase
    .from("processing_queue")
    .update(data)
    .eq("player_data_id", player_data_id)
    .select()
    .single();

  if (queueError) throw queueError;
  return queueData;
};
