```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE metrics (
  metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  match_id UUID NOT NULL,
  session_id VARCHAR(36),
  talent_index_score DECIMAL(5,2),
  current_ability DECIMAL(5,2),
  growth_trajectory DECIMAL(5,2),
  technical_proficiency DECIMAL(5,2),
  tactical_intelligence DECIMAL(5,2),
  spatial_intelligence DECIMAL(5,2),
  team_elevation_effect DECIMAL(5,2),
  passing_options_created DECIMAL(5,2),
  intelligent_defensive_work DECIMAL(5,2),
  defensive_transition_reaction DECIMAL(5,2),
  press_success_rate DECIMAL(5,2),
  clutch_mentality DECIMAL(5,2),
  consistency_score DECIMAL(5,2),
  short_passing_completion DECIMAL(5,2),
  under_pressure_passing DECIMAL(5,2),
  progressive_passes_per90 DECIMAL(5,2),
  passes_into_final_third_per90 DECIMAL(5,2),
  first_touch_quality DECIMAL(5,2),
  first_touch_success_rate DECIMAL(5,2),
  ball_retention_score DECIMAL(5,2),
  dribbling_success_rate DECIMAL(5,2),
  shot_frequency_per90 DECIMAL(5,2),
  shot_accuracy DECIMAL(5,2),
  goals_per90 DECIMAL(5,2),
  goals_vs_xg DECIMAL(5,2),
  defensive_third_percentage DECIMAL(5,2),
  middle_third_percentage DECIMAL(5,2),
  attacking_third_percentage DECIMAL(5,2),
  positional_balance DECIMAL(5,2),
  pocket_finding_ability DECIMAL(5,2),
  space_creation DECIMAL(5,2),
  link_up_positioning DECIMAL(5,2),
  defensive_positioning DECIMAL(5,2),
  covers_passing_lanes_success DECIMAL(5,2),
  appropriate_movement_transitions DECIMAL(5,2),
  press_frequency DECIMAL(5,2),
  press_intensity DECIMAL(5,2),
  running_iq DECIMAL(5,2),
  reaction_speed DECIMAL(5,2),
  transition_iq DECIMAL(5,2),
  exploits_counter_attacks_success DECIMAL(5,2),
  transition_quality DECIMAL(5,2),
  total_distance_covered DECIMAL(8,2),
  high_speed_running_distance DECIMAL(8,2),
  sprint_distance DECIMAL(8,2),
  max_speed DECIMAL(6,2),
  fatigue_resistance DECIMAL(5,2),
  sprint_maintenance DECIMAL(5,2),
  stamina_index DECIMAL(5,2),
  acwr_ratio DECIMAL(5,2),
  injury_risk DECIMAL(5,2),
  movement_asymmetry DECIMAL(5,2),
  recovery_status DECIMAL(5,2),
  physical_maturity DECIMAL(5,2),
  max_speed_projection DECIMAL(6,2),
  sprint_capacity_projection DECIMAL(8,2),
  total_endurance_projection DECIMAL(8,2),
  physical_ceiling DECIMAL(5,2),
  match_to_match_sd DECIMAL(5,2),
  worst_match_rating DECIMAL(5,2),
  best_match_rating DECIMAL(5,2),
  floor_quality DECIMAL(5,2),
  within_match_variation DECIMAL(5,2),
  performance_after_mistakes DECIMAL(5,2),
  resilience_index DECIMAL(5,2),
  performance_after_opponent_goal DECIMAL(5,2),
  leadership_response DECIMAL(5,2),
  high_stakes_performance DECIMAL(5,2),
  big_game_player_index DECIMAL(5,2),
  final_15_minutes_performance DECIMAL(5,2),
  clutch_performance_rating DECIMAL(5,2),
  pass_selection_quality DECIMAL(5,2),
  decision_making_score DECIMAL(5,2),
  calculated_risks_per_match DECIMAL(5,2),
  unnecessary_risks_per_match DECIMAL(5,2),
  risk_reward_balance DECIMAL(5,2),
  game_intelligence DECIMAL(5,2),
  on_field_communication DECIMAL(5,2),
  vocal_leadership DECIMAL(5,2),
  leadership_score DECIMAL(5,2),
  captain_potential DECIMAL(5,2),
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(player_id),
  FOREIGN KEY (match_id) REFERENCES events(match_id)
);

-- Create trigger function to update updated_at (if needed, though not in original)
CREATE OR REPLACE FUNCTION update_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.calculated_at = CURRENT_TIMESTAMP; -- Use calculated_at instead of updated_at
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
CREATE TRIGGER update_metrics_calculated_at
BEFORE UPDATE ON metrics
FOR EACH ROW
EXECUTE FUNCTION update_metrics_updated_at();

-- Corrected Example Data
INSERT INTO metrics (metric_id, player_id, match_id, session_id, talent_index_score, current_ability, growth_trajectory, technical_proficiency, tactical_intelligence, spatial_intelligence, team_elevation_effect, passing_options_created, intelligent_defensive_work, defensive_transition_reaction, press_success_rate, clutch_mentality, consistency_score)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'S2025-10-20', 83.60, 82.00, 93.00, 84.00, 87.00, 94.00, 24.00, 4.60, 91.00, 93.00, 61.00, 91.00, 89.00);

```
