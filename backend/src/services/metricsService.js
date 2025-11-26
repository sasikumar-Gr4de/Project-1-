import { supabase } from "../config/supabase.config.js";

export const createPlayerMetrics = async (data) => {
  const { player_id, player_data_id } = data;
  await supabase.from("player_metrics").insert([
    {
      player_id: player_id,
      data_id: player_data_id,
      metric_type: "overall",
      metric_name: "gr4de-score",
      metric_vallue: data.scoring_metrics.gr4de_score,
      percentile: data.benchmark_comparison.percentiles.overall_score,
      origin_data: data.scoring_metrics,
    },
  ]);
};
