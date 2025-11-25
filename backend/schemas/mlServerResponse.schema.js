/**
 * Zod Schema for ML Server Response Validation
 * Use this in backend to validate incoming ML Server responses
 */
import { z } from 'zod';

// ============================================
// BASE SCHEMAS
// ============================================

const MatchMetadataSchema = z.object({
  match_id: z.string().uuid().optional(),
  match_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  competition: z.string(),
  opponent: z.string(),
  venue: z.enum(['home', 'away', 'neutral']),
  result: z.enum(['win', 'loss', 'draw']),
  final_score: z.string().optional(),
  minutes_played: z.number().min(0).max(120),
  position_played: z.string(),
  formation: z.string(),
  jersey_number: z.number().int().min(1).max(99)
});

const ConfidenceIntervalSchema = z.object({
  lower: z.number().min(0).max(100),
  upper: z.number().min(0).max(100),
  confidence_level: z.number().min(0).max(1).default(0.95)
});

const PillarsSchema = z.object({
  technical: z.number().min(0).max(100),
  tactical: z.number().min(0).max(100),
  physical: z.number().min(0).max(100),
  mental: z.number().min(0).max(100)
});

const TempoSchema = z.object({
  index: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100)
});

const ScoringMetricsSchema = z.object({
  overall_score: z.number().min(0).max(100),
  gr4de_score: z.number().min(0).max(100),
  confidence_interval: ConfidenceIntervalSchema.optional(),
  pillars: PillarsSchema,
  tempo: TempoSchema
});

// ============================================
// TECHNICAL METRICS
// ============================================

const PassingMetricsSchema = z.object({
  total_passes: z.number().int().min(0),
  passes_completed: z.number().int().min(0),
  completion_rate: z.number().min(0).max(100),
  pass_accuracy_short: z.number().min(0).max(100).optional(),
  pass_accuracy_medium: z.number().min(0).max(100).optional(),
  pass_accuracy_long: z.number().min(0).max(100).optional(),
  progressive_passes: z.number().int().min(0).optional(),
  key_passes: z.number().int().min(0).optional(),
  avg_pass_length_m: z.number().min(0).optional(),
  forward_passes: z.number().int().min(0).optional(),
  backward_passes: z.number().int().min(0).optional(),
  lateral_passes: z.number().int().min(0).optional()
});

const BallControlMetricsSchema = z.object({
  touches: z.number().int().min(0),
  successful_touches: z.number().int().min(0),
  touch_success_rate: z.number().min(0).max(100),
  first_touch_success: z.number().min(0).max(100).optional(),
  touches_in_box: z.number().int().min(0).optional(),
  touches_in_final_third: z.number().int().min(0).optional(),
  heavy_touches: z.number().int().min(0).optional()
});

const ShootingMetricsSchema = z.object({
  total_shots: z.number().int().min(0),
  shots_on_target: z.number().int().min(0),
  shot_accuracy: z.number().min(0).max(100),
  goals: z.number().int().min(0),
  xg_total: z.number().min(0),
  xg_per_shot: z.number().min(0).optional(),
  conversion_rate: z.number().min(0).max(100).optional(),
  shot_locations: z.array(z.object({
    x: z.number(),
    y: z.number(),
    xg: z.number().min(0).max(1),
    outcome: z.enum(['goal', 'saved', 'blocked', 'off_target', 'post']),
    type: z.enum(['inside_box', 'outside_box', 'header']).optional(),
    body_part: z.enum(['right_foot', 'left_foot', 'header', 'other']).optional()
  })).optional()
});

const TechnicalMetricsSchema = z.object({
  score: z.number().min(0).max(100),
  percentile: z.number().int().min(0).max(100).optional(),
  details: z.object({
    passing: PassingMetricsSchema,
    ball_control: BallControlMetricsSchema,
    shooting: ShootingMetricsSchema.optional(),
    dribbling: z.object({
      total_dribbles: z.number().int().min(0),
      successful_dribbles: z.number().int().min(0),
      dribble_success_rate: z.number().min(0).max(100)
    }).optional(),
    receiving: z.object({
      balls_received: z.number().int().min(0),
      successful_receptions: z.number().int().min(0),
      reception_success_rate: z.number().min(0).max(100)
    }).optional()
  })
});

// ============================================
// POSITION-SPECIFIC METRICS SCHEMAS
// ============================================

// STRIKER SPECIFIC
const StrikerMetricsSchema = z.object({
  position: z.literal('striker'),
  striker_metrics: z.object({
    finishing: z.object({
      touches_in_final_third: z.number().int().min(0),
      touches_in_penalty_box: z.number().int().min(0),

      // Inside box
      shots_inside_box: z.number().int().min(0),
      on_target_inside_box: z.number().int().min(0),
      goals_inside_box: z.number().int().min(0),
      off_target_inside_box: z.number().int().min(0),
      xg_inside_box: z.number().min(0),

      // Outside box
      shots_outside_box: z.number().int().min(0),
      on_target_outside_box: z.number().int().min(0),
      goals_outside_box: z.number().int().min(0),
      off_target_outside_box: z.number().int().min(0),
      xg_outside_box: z.number().min(0),

      // Headers
      headers_attempted: z.number().int().min(0),
      headers_on_target: z.number().int().min(0),
      headers_goals: z.number().int().min(0),
      headers_off_target: z.number().int().min(0),
      xg_headers: z.number().min(0),

      finishing_quality_score: z.number().min(0).max(100),
      clinical_finishing_rate: z.number().min(0).max(100),
      conversion_rate: z.number().min(0).max(100)
    }),
    striker_movement: z.object({
      runs_in_behind: z.number().int().min(0),
      successful_runs_in_behind: z.number().int().min(0),
      movement_effectiveness: z.number().min(0).max(100)
    }),
    link_up_play: z.object({
      link_up_play_attempts: z.number().int().min(0),
      successful_link_ups: z.number().int().min(0),
      link_up_success_rate: z.number().min(0).max(100)
    }),
    aerial_game: z.object({
      aerial_duels: z.number().int().min(0),
      aerial_duels_won: z.number().int().min(0),
      aerial_win_rate: z.number().min(0).max(100)
    })
  })
});

// MIDFIELDER SPECIFIC
const MidfielderMetricsSchema = z.object({
  position: z.literal('midfielder'),
  midfielder_metrics: z.object({
    passing_distribution: z.object({
      total_forward_passes: z.number().int().min(0),
      successful_forward_passes: z.number().int().min(0),
      forward_pass_accuracy: z.number().min(0).max(100),

      total_lateral_passes: z.number().int().min(0),
      successful_lateral_passes: z.number().int().min(0),
      lateral_pass_accuracy: z.number().min(0).max(100),

      avg_pass_distance_m: z.number().min(0),
      short_passes: z.number().int().min(0),
      long_passes: z.number().int().min(0)
    }),
    transition_play: z.object({
      defensive_to_offensive_transitions: z.number().int().min(0),
      successful_transitions: z.number().int().min(0),
      avg_short_passes_defense_to_attack: z.number().min(0),
      long_passes_defense_to_attack: z.number().int().min(0),
      successful_long_passes_defense_to_attack: z.number().int().min(0)
    }),
    tempo_control: z.object({
      match_tempo_index: z.number().min(0).max(100),
      tempo_dictating_actions: z.number().int().min(0),
      tempo_consistency: z.number().min(0).max(100)
    })
  })
});

// DEFENDER SPECIFIC
const DefenderMetricsSchema = z.object({
  position: z.literal('defender'),
  defender_metrics: z.object({
    defensive_actions: z.object({
      crucial_tackles: z.number().int().min(0),
      successful_tackles: z.number().int().min(0),
      unsuccessful_tackles: z.number().int().min(0),
      tackle_success_rate: z.number().min(0).max(100),

      simple_interceptions: z.number().int().min(0),
      simple_clearances: z.number().int().min(0),
      blocks: z.number().int().min(0),
      shots_intercepted: z.number().int().min(0)
    }),
    pressing: z.object({
      key_presses: z.number().int().min(0),
      successful_presses: z.number().int().min(0),
      unsuccessful_presses: z.number().int().min(0),
      press_success_rate: z.number().min(0).max(100)
    }),
    threat_prevention: z.object({
      shots_allowed_from_through_balls: z.number().int().min(0),
      defensive_errors: z.number().int().min(0),
      last_man_tackles: z.number().int().min(0)
    }),
    aerial_dominance: z.object({
      aerial_duels: z.number().int().min(0),
      aerial_duels_won: z.number().int().min(0),
      aerial_win_rate: z.number().min(0).max(100)
    })
  })
});

// GOALKEEPER SPECIFIC
const GoalkeeperMetricsSchema = z.object({
  position: z.literal('goalkeeper'),
  goalkeeper_metrics: z.object({
    shot_stopping: z.object({
      simple_saves: z.number().int().min(0),
      brilliant_saves: z.number().int().min(0),
      key_saves: z.number().int().min(0),
      total_saves: z.number().int().min(0),
      save_percentage: z.number().min(0).max(100),
      goals_conceded: z.number().int().min(0),
      xg_prevented: z.number()
    }),
    crosses_handling: z.object({
      crosses_faced: z.number().int().min(0),
      crosses_collected: z.number().int().min(0),
      cross_collection_rate: z.number().min(0).max(100),
      crosses_punched: z.number().int().min(0)
    }),
    distribution: z.object({
      goalkeeper_short_passes: z.number().int().min(0),
      goalkeeper_long_passes: z.number().int().min(0),
      short_pass_accuracy: z.number().min(0).max(100),
      long_pass_accuracy: z.number().min(0).max(100),

      kicks_attempted: z.number().int().min(0),
      successful_distribution: z.number().int().min(0),
      distribution_success_rate: z.number().min(0).max(100)
    }),
    command_of_area: z.object({
      sweeper_actions: z.number().int().min(0),
      successful_sweeper_actions: z.number().int().min(0),
      command_rating: z.number().min(0).max(100)
    })
  })
});

// Union of position-specific metrics
const PositionSpecificMetricsSchema = z.discriminatedUnion('position', [
  StrikerMetricsSchema,
  MidfielderMetricsSchema,
  DefenderMetricsSchema,
  GoalkeeperMetricsSchema
]);

// ============================================
// BENCHMARKS
// ============================================

const BenchmarkComparisonSchema = z.object({
  cohort: z.object({
    position: z.string(),
    age_group: z.string(),
    level: z.enum(['youth', 'amateur', 'professional', 'elite']),
    competition: z.string().optional(),
    sample_size: z.number().int().min(1)
  }),
  percentiles: z.record(z.string(), z.number().min(0).max(100)),
  vs_average: z.record(z.string(), z.string()).optional(),
  vs_top_10_pct: z.record(z.string(), z.string()).optional()
});

// ============================================
// INSIGHTS
// ============================================

const InsightSchema = z.object({
  type: z.enum(['strength', 'opportunity', 'trend', 'warning']),
  category: z.enum(['technical', 'tactical', 'physical', 'mental']),
  title: z.string(),
  description: z.string(),
  metric_name: z.string(),
  metric_value: z.number(),
  percentile: z.number().int().min(0).max(100).optional(),
  cohort_avg: z.number().optional(),
  improvement_potential: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'])
});

// ============================================
// RAW FILES
// ============================================

const RawFileUrlsSchema = z.object({
  video_annotated: z.string().url(),
  events_csv: z.string().url(),
  detections_csv: z.string().url(),
  heatmap_image: z.string().url().optional(),
  shot_map_image: z.string().url().optional(),
  passing_network_image: z.string().url().optional()
});

// ============================================
// METADATA
// ============================================

const MetadataSchema = z.object({
  model_version: z.string(),
  pipeline_version: z.string(),
  processing_pipeline: z.string(),
  confidence_score: z.number().min(0).max(1),
  data_quality: z.object({
    video_quality: z.enum(['low', 'medium', 'high']),
    frame_rate: z.number().optional(),
    resolution: z.string().optional(),
    player_visibility_avg: z.number().min(0).max(1).optional(),
    tracking_confidence_avg: z.number().min(0).max(1).optional(),
    jersey_detection_confidence: z.number().min(0).max(1).optional()
  })
});

// ============================================
// MAIN RESPONSE SCHEMA
// ============================================

export const MLServerResponseSchema = z.object({
  status: z.enum(['success', 'partial_success', 'error']),
  timestamp: z.string().datetime(),
  processing_time_ms: z.number().positive().optional(),

  data: z.object({
    job_id: z.string().uuid(),
    player_data_id: z.string().uuid(),
    player_id: z.string().uuid(),

    match_metadata: MatchMetadataSchema,
    scoring_metrics: ScoringMetricsSchema,
    technical_metrics: TechnicalMetricsSchema,
    tactical_metrics: z.object({}).passthrough(), // Flexible schema
    physical_metrics: z.object({}).passthrough(), // Flexible schema
    mental_metrics: z.object({}).passthrough(), // Flexible schema
    tempo_results: z.object({}).passthrough(), // Flexible schema

    position_specific_metrics: PositionSpecificMetricsSchema,

    benchmark_comparison: BenchmarkComparisonSchema,
    insights: z.array(InsightSchema),
    raw_file_urls: RawFileUrlsSchema,

    event_array: z.array(z.object({}).passthrough()).optional(),
    gps_summary: z.object({}).passthrough().optional(),
    event_summary: z.object({}).passthrough().optional()
  }),

  metadata: MetadataSchema,

  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.string().optional(),
    retry_allowed: z.boolean().optional(),
    suggestions: z.array(z.string()).optional()
  }).optional()
});

// Export type for TypeScript
export type MLServerResponse = z.infer<typeof MLServerResponseSchema>;

// Validation function
export function validateMLServerResponse(data) {
  return MLServerResponseSchema.parse(data);
}

export function validateMLServerResponseSafe(data) {
  return MLServerResponseSchema.safeParse(data);
}
