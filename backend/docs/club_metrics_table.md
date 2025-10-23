```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE team_metrics (
  team_metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL,
  match_id UUID NOT NULL,
  session_id VARCHAR(36),
  talent_index_score_avg DECIMAL(5,2), -- Average of player talent scores
  current_ability_avg DECIMAL(5,2), -- Average of player current abilities
  growth_trajectory_avg DECIMAL(5,2), -- Average of player growth trajectories
  technical_proficiency_avg DECIMAL(5,2), -- Average of player technical proficiencies
  tactical_intelligence_avg DECIMAL(5,2), -- Average of player tactical intelligences
  spatial_intelligence_avg DECIMAL(5,2), -- Average of player spatial intelligences
  team_elevation_effect_avg DECIMAL(5,2), -- Average team elevation effect
  passing_options_created_avg DECIMAL(5,2), -- Average passing options created
  intelligent_defensive_work_avg DECIMAL(5,2), -- Average intelligent defensive work
  defensive_transition_reaction_avg DECIMAL(5,2), -- Average defensive transition reaction
  press_success_rate_avg DECIMAL(5,2), -- Average press success rate
  clutch_mentality_avg DECIMAL(5,2), -- Average clutch mentality
  consistency_score_avg DECIMAL(5,2), -- Average consistency score
  short_passing_completion_avg DECIMAL(5,2), -- Average short passing completion
  under_pressure_passing_avg DECIMAL(5,2), -- Average under pressure passing
  progressive_passes_per90_total DECIMAL(8,2), -- Total progressive passes per 90 (sum)
  passes_into_final_third_per90_total DECIMAL(8,2), -- Total passes into final third per 90
  first_touch_quality_avg DECIMAL(5,2), -- Average first touch quality
  first_touch_success_rate_avg DECIMAL(5,2), -- Average first touch success rate
  ball_retention_score_avg DECIMAL(5,2), -- Average ball retention score
  dribbling_success_rate_avg DECIMAL(5,2), -- Average dribbling success rate
  shot_frequency_per90_total DECIMAL(8,2), -- Total shot frequency per 90
  shot_accuracy_avg DECIMAL(5,2), -- Average shot accuracy
  goals_per90_total DECIMAL(8,2), -- Total goals per 90
  goals_vs_xg_total DECIMAL(8,2), -- Total goals vs xG
  defensive_third_percentage_avg DECIMAL(5,2), -- Average defensive third percentage
  middle_third_percentage_avg DECIMAL(5,2), -- Average middle third percentage
  attacking_third_percentage_avg DECIMAL(5,2), -- Average attacking third percentage
  positional_balance_avg DECIMAL(5,2), -- Average positional balance
  pocket_finding_ability_avg DECIMAL(5,2), -- Average pocket finding ability
  space_creation_avg DECIMAL(5,2), -- Average space creation
  link_up_positioning_avg DECIMAL(5,2), -- Average link-up positioning
  defensive_positioning_avg DECIMAL(5,2), -- Average defensive positioning
  covers_passing_lanes_success_avg DECIMAL(5,2), -- Average covers passing lanes success
  appropriate_movement_transitions_avg DECIMAL(5,2), -- Average appropriate movement transitions
  press_frequency_total DECIMAL(8,2), -- Total press frequency
  press_intensity_avg DECIMAL(5,2), -- Average press intensity
  running_iq_avg DECIMAL(5,2), -- Average running IQ
  reaction_speed_avg DECIMAL(5,2), -- Average reaction speed
  transition_iq_avg DECIMAL(5,2), -- Average transition IQ
  exploits_counter_attacks_success_avg DECIMAL(5,2), -- Average exploits counter-attacks success
  transition_quality_avg DECIMAL(5,2), -- Average transition quality
  total_distance_covered_total DECIMAL(10,2), -- Total distance covered
  high_speed_running_distance_total DECIMAL(10,2), -- Total high-speed running distance
  sprint_distance_total DECIMAL(10,2), -- Total sprint distance
  max_speed_avg DECIMAL(6,2), -- Average max speed
  fatigue_resistance_avg DECIMAL(5,2), -- Average fatigue resistance
  sprint_maintenance_avg DECIMAL(5,2), -- Average sprint maintenance
  stamina_index_avg DECIMAL(5,2), -- Average stamina index
  acwr_ratio_avg DECIMAL(5,2), -- Average ACWR ratio
  injury_risk_avg DECIMAL(5,2), -- Average injury risk
  movement_asymmetry_avg DECIMAL(5,2), -- Average movement asymmetry
  recovery_status_avg DECIMAL(5,2), -- Average recovery status
  physical_maturity_avg DECIMAL(5,2), -- Average physical maturity
  max_speed_projection_avg DECIMAL(6,2), -- Average max speed projection
  sprint_capacity_projection_total DECIMAL(10,2), -- Total sprint capacity projection
  total_endurance_projection_total DECIMAL(10,2), -- Total endurance projection
  physical_ceiling_avg DECIMAL(5,2), -- Average physical ceiling
  match_to_match_sd_avg DECIMAL(5,2), -- Average match-to-match SD
  worst_match_rating_avg DECIMAL(5,2), -- Average worst match rating
  best_match_rating_avg DECIMAL(5,2), -- Average best match rating
  floor_quality_avg DECIMAL(5,2), -- Average floor quality
  within_match_variation_avg DECIMAL(5,2), -- Average within-match variation
  performance_after_mistakes_avg DECIMAL(5,2), -- Average performance after mistakes
  resilience_index_avg DECIMAL(5,2), -- Average resilience index
  performance_after_opponent_goal_avg DECIMAL(5,2), -- Average performance after opponent goal
  leadership_response_avg DECIMAL(5,2), -- Average leadership response
  high_stakes_performance_avg DECIMAL(5,2), -- Average high-stakes performance
  big_game_player_index_avg DECIMAL(5,2), -- Average big game player index
  final_15_minutes_performance_avg DECIMAL(5,2), -- Average final 15 minutes performance
  clutch_performance_rating_avg DECIMAL(5,2), -- Average clutch performance rating
  pass_selection_quality_avg DECIMAL(5,2), -- Average pass selection quality
  decision_making_score_avg DECIMAL(5,2), -- Average decision making score
  calculated_risks_per_match_total DECIMAL(8,2), -- Total calculated risks per match
  unnecessary_risks_per_match_total DECIMAL(8,2), -- Total unnecessary risks per match
  risk_reward_balance_avg DECIMAL(5,2), -- Average risk/reward balance
  game_intelligence_avg DECIMAL(5,2), -- Average game intelligence
  on_field_communication_avg DECIMAL(5,2), -- Average on-field communication
  vocal_leadership_avg DECIMAL(5,2), -- Average vocal leadership
  leadership_score_avg DECIMAL(5,2), -- Average leadership score
  captain_potential_avg DECIMAL(5,2), -- Average captain potential
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES clubs(club_id),
  FOREIGN KEY (match_id) REFERENCES events(match_id)
);

-- Create trigger function to update calculated_at
CREATE OR REPLACE FUNCTION update_team_metrics_calculated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.calculated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
CREATE TRIGGER update_team_metrics_calculated_at
BEFORE UPDATE ON team_metrics
FOR EACH ROW
EXECUTE FUNCTION update_team_metrics_calculated_at();

-- Example Data (Aggregated from players)
INSERT INTO team_metrics (team_metric_id, team_id, match_id, session_id, talent_index_score_avg, current_ability_avg, growth_trajectory_avg, technical_proficiency_avg, tactical_intelligence_avg, spatial_intelligence_avg, team_elevation_effect_avg, passing_options_created_avg, intelligent_defensive_work_avg, defensive_transition_reaction_avg, press_success_rate_avg, clutch_mentality_avg, consistency_score_avg)
VALUES
  ('550e8402-e29b-41d4-a716-446655440002', '550e8403-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'S2025-10-20', 83.60, 82.00, 93.00, 84.00, 87.00, 94.00, 24.00, 4.60, 91.00, 93.00, 61.00, 91.00, 89.00);
```
