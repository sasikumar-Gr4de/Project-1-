import { supabase } from "../config/supabase.config.js";

export const createQueue = async (data) => {
  const { data, error } = await supabase
    .from("processing_queue")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return data;
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

export const updateQueue = async (queueId, data) => {
  const { data, error } = await supabase
    .from("processing_queue")
    .update(data)
    .eq("id", queueId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
