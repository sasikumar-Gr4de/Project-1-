export const mockMatchData = {
  match_id: "match-001",
  home_club_id: "club-001",
  away_club_id: "club-002",
  match_date: "2024-03-15T15:00:00Z",
  venue: "Camp Nou",
  competition: "La Liga Juvenil U19",
  match_status: "completed",
  score_home: 3,
  score_away: 1,
  duration_minutes: 92,
  video_url: "https://example.com/match-video.mp4",
  tagged_by: "user-001",
  qa_status: "approved",
  notes:
    "Excellent performance from young talents. Strong tactical discipline from both teams.",
  created_at: "2024-03-15T10:00:00Z",
  updated_at: "2024-03-15T18:00:00Z",
};

export const mockClubsData = {
  "club-001": {
    club_id: "club-001",
    name: "FC Barcelona Juvenil A",
    short_name: "BAR",
    logo: "/src/assets/images/logo.png",
    location: "Barcelona, Spain",
    coach: "Xavi Hernandez Jr.",
    formation: "4-3-3",
    style: "Possession, High Press",
  },
  "club-002": {
    club_id: "club-002",
    name: "Real Madrid Juvenil A",
    short_name: "RMA",
    logo: "/src/assets/images/logo.png",
    location: "Madrid, Spain",
    coach: "Carlo Ancelotti Jr.",
    formation: "4-2-3-1",
    style: "Counter Attack, Organized",
  },
};

export const mockPlayersData = {
  "club-001": [
    {
      player_id: "player-001",
      name: "Lamine Yamal",
      position: "RW",
      jersey_number: 19,
      age: 16,
      nationality: "Spain",
      height: 178,
      weight: 68,
      avatar: null,
      metrics: {
        talent_index_score: 88.5,
        current_ability: 86.2,
        growth_trajectory: 92.1,
        technical_proficiency: 89.3,
        tactical_intelligence: 85.7,
        physical_attributes: 82.4,
        mental_attributes: 84.8,
        goals: 1,
        assists: 0,
        passes_completed: 45,
        pass_accuracy: 87.2,
        dribbles_successful: 8,
        tackles_won: 2,
      },
    },
    {
      player_id: "player-002",
      name: "Gavi",
      position: "CM",
      jersey_number: 6,
      age: 19,
      nationality: "Spain",
      height: 173,
      weight: 70,
      avatar: null,
      metrics: {
        talent_index_score: 91.2,
        current_ability: 89.8,
        growth_trajectory: 88.5,
        technical_proficiency: 92.1,
        tactical_intelligence: 94.3,
        physical_attributes: 86.7,
        mental_attributes: 90.1,
        goals: 1,
        assists: 1,
        passes_completed: 78,
        pass_accuracy: 93.4,
        dribbles_successful: 6,
        tackles_won: 5,
      },
    },
    {
      player_id: "player-003",
      name: "Pedri",
      position: "CAM",
      jersey_number: 8,
      age: 21,
      nationality: "Spain",
      height: 174,
      weight: 68,
      avatar: null,
      metrics: {
        talent_index_score: 93.4,
        current_ability: 91.8,
        growth_trajectory: 85.2,
        technical_proficiency: 94.7,
        tactical_intelligence: 95.1,
        physical_attributes: 83.9,
        mental_attributes: 92.6,
        goals: 1,
        assists: 2,
        passes_completed: 92,
        pass_accuracy: 95.1,
        dribbles_successful: 7,
        tackles_won: 3,
      },
    },
    {
      player_id: "player-004",
      name: "Ronald Araujo",
      position: "CB",
      jersey_number: 4,
      age: 24,
      nationality: "Uruguay",
      height: 188,
      weight: 79,
      avatar: null,
      metrics: {
        talent_index_score: 85.7,
        current_ability: 87.9,
        growth_trajectory: 82.1,
        technical_proficiency: 83.4,
        tactical_intelligence: 88.2,
        physical_attributes: 91.5,
        mental_attributes: 86.8,
        goals: 0,
        assists: 0,
        passes_completed: 65,
        pass_accuracy: 89.3,
        dribbles_successful: 1,
        tackles_won: 8,
      },
    },
  ],
  "club-002": [
    {
      player_id: "player-005",
      name: "Jude Bellingham",
      position: "CM",
      jersey_number: 5,
      age: 20,
      nationality: "England",
      height: 186,
      weight: 75,
      avatar: null,
      metrics: {
        talent_index_score: 94.1,
        current_ability: 92.8,
        growth_trajectory: 89.7,
        technical_proficiency: 91.2,
        tactical_intelligence: 93.8,
        physical_attributes: 88.4,
        mental_attributes: 94.2,
        goals: 1,
        assists: 0,
        passes_completed: 67,
        pass_accuracy: 88.9,
        dribbles_successful: 5,
        tackles_won: 4,
      },
    },
    {
      player_id: "player-006",
      name: "Vinicius Junior",
      position: "LW",
      jersey_number: 7,
      age: 23,
      nationality: "Brazil",
      height: 176,
      weight: 73,
      avatar: null,
      metrics: {
        talent_index_score: 90.8,
        current_ability: 90.2,
        growth_trajectory: 86.4,
        technical_proficiency: 92.7,
        tactical_intelligence: 84.3,
        physical_attributes: 89.1,
        mental_attributes: 82.9,
        goals: 0,
        assists: 0,
        passes_completed: 42,
        pass_accuracy: 83.7,
        dribbles_successful: 11,
        tackles_won: 1,
      },
    },
    {
      player_id: "player-007",
      name: "Federico Valverde",
      position: "CDM",
      jersey_number: 15,
      age: 25,
      nationality: "Uruguay",
      height: 182,
      weight: 78,
      avatar: null,
      metrics: {
        talent_index_score: 87.9,
        current_ability: 88.5,
        growth_trajectory: 83.2,
        technical_proficiency: 86.4,
        tactical_intelligence: 89.7,
        physical_attributes: 90.8,
        mental_attributes: 87.3,
        goals: 0,
        assists: 0,
        passes_completed: 58,
        pass_accuracy: 87.6,
        dribbles_successful: 3,
        tackles_won: 6,
      },
    },
    {
      player_id: "player-008",
      name: "Eder Militao",
      position: "CB",
      jersey_number: 3,
      age: 25,
      nationality: "Brazil",
      height: 186,
      weight: 82,
      avatar: null,
      metrics: {
        talent_index_score: 86.2,
        current_ability: 87.1,
        growth_trajectory: 84.8,
        technical_proficiency: 84.9,
        tactical_intelligence: 87.5,
        physical_attributes: 89.3,
        mental_attributes: 85.7,
        goals: 0,
        assists: 0,
        passes_completed: 52,
        pass_accuracy: 86.4,
        dribbles_successful: 2,
        tackles_won: 7,
      },
    },
  ],
};

export const mockMatchMetrics = {
  possession: { home: 62, away: 38 },
  shots: { home: 18, away: 9 },
  shots_on_target: { home: 8, away: 4 },
  passes: { home: 645, away: 387 },
  pass_accuracy: { home: 89, away: 82 },
  tackles: { home: 22, away: 28 },
  interceptions: { home: 15, away: 18 },
  fouls: { home: 12, away: 16 },
  corners: { home: 7, away: 3 },
  offsides: { home: 2, away: 4 },
};

export const mockMatchEvents = [
  { time: "15'", event: "⚽ Goal - Lamine Yamal", team: "home", type: "goal" },
  {
    time: "23'",
    event: "🟨 Yellow Card - Federico Valverde",
    team: "away",
    type: "card",
  },
  {
    time: "34'",
    event: "🔄 Substitution - Rodrygo OUT, Brahim IN",
    team: "away",
    type: "substitution",
  },
  { time: "45+1'", event: "⏱️ Half Time", team: "neutral", type: "period" },
  {
    time: "52'",
    event: "🟨 Yellow Card - Ronald Araujo",
    team: "home",
    type: "card",
  },
  { time: "67'", event: "⚽ Goal - Gavi", team: "home", type: "goal" },
  {
    time: "72'",
    event: "🔄 Substitution - Ferran OUT, Raphinha IN",
    team: "home",
    type: "substitution",
  },
  {
    time: "78'",
    event: "⚽ Goal - Jude Bellingham",
    team: "away",
    type: "goal",
  },
  {
    time: "84'",
    event: "🟨 Yellow Card - Eder Militao",
    team: "away",
    type: "card",
  },
  { time: "89'", event: "⚽ Goal - Pedri", team: "home", type: "goal" },
  { time: "90+2'", event: "⏱️ Full Time", team: "neutral", type: "period" },
];

// src/mock/analysisMetrics.js
export const mockMetricsData = {
  "player-001": {
    // Core Talent Metrics
    talent_index_score: 88.5,
    current_ability: 86.2,
    growth_trajectory: 92.1,

    // Technical Proficiency
    technical_proficiency: 89.3,
    tactical_intelligence: 85.7,
    spatial_intelligence: 87.4,

    // Team Impact
    team_elevation_effect: 87.9,
    passing_options_created: 84.5,
    intelligent_defensive_work: 82.3,

    // Defensive Metrics
    defensive_transition_reaction: 83.7,
    press_success_rate: 78.9,
    clutch_mentality: 85.2,
    consistency_score: 84.8,

    // Passing Metrics
    short_passing_completion: 91.2,
    under_pressure_passing: 82.4,
    progressive_passes_per90: 6.8,
    passes_into_final_third_per90: 4.2,

    // Ball Control
    first_touch_quality: 88.7,
    first_touch_success_rate: 90.1,
    ball_retention_score: 86.9,
    dribbling_success_rate: 78.3,

    // Shooting Metrics
    shot_frequency_per90: 3.2,
    shot_accuracy: 42.8,
    goals_per90: 0.8,
    goals_vs_xg: 1.1,

    // Positioning & Movement
    defensive_third_percentage: 12.4,
    middle_third_percentage: 45.8,
    attacking_third_percentage: 41.8,
    positional_balance: 84.2,
    pocket_finding_ability: 86.7,
    space_creation: 83.9,
    link_up_positioning: 85.4,

    // Defensive Positioning
    defensive_positioning: 81.6,
    covers_passing_lanes_success: 79.8,
    appropriate_movement_transitions: 83.1,

    // Pressing & Intensity
    press_frequency: 18.2,
    press_intensity: 82.7,
    running_iq: 85.9,
    reaction_speed: 87.3,

    // Transition Intelligence
    transition_iq: 84.6,
    exploits_counter_attacks_success: 81.9,
    transition_quality: 83.8,

    // Physical Metrics
    total_distance_covered: 11250.5,
    high_speed_running_distance: 1850.3,
    sprint_distance: 680.7,
    max_speed: 34.2,
    fatigue_resistance: 84.2,
    sprint_maintenance: 82.8,
    stamina_index: 85.7,

    // Load & Recovery
    acwr_ratio: 1.2,
    injury_risk: 12.4,
    movement_asymmetry: 3.8,
    recovery_status: 88.9,

    // Physical Projections
    physical_maturity: 78.4,
    max_speed_projection: 35.8,
    sprint_capacity_projection: 750.2,
    total_endurance_projection: 12500.8,
    physical_ceiling: 89.3,

    // Consistency & Resilience
    match_to_match_sd: 6.2,
    worst_match_rating: 72.4,
    best_match_rating: 92.8,
    floor_quality: 75.6,
    within_match_variation: 8.3,
    performance_after_mistakes: 83.7,
    resilience_index: 84.9,

    // Big Game Performance
    performance_after_opponent_goal: 82.1,
    leadership_response: 79.8,
    high_stakes_performance: 83.5,
    big_game_player_index: 81.7,
    final_15_minutes_performance: 84.2,
    clutch_performance_rating: 83.8,

    // Decision Making
    pass_selection_quality: 86.4,
    decision_making_score: 88.7,
    calculated_risks_per_match: 4.8,
    unnecessary_risks_per_match: 1.2,
    risk_reward_balance: 87.3,
    game_intelligence: 86.9,

    // Leadership & Communication
    on_field_communication: 82.7,
    vocal_leadership: 78.4,
    leadership_score: 82.3,
    captain_potential: 76.8,
  },

  "player-002": {
    // Core Talent Metrics
    talent_index_score: 91.2,
    current_ability: 89.8,
    growth_trajectory: 88.5,

    // Technical Proficiency
    technical_proficiency: 92.1,
    tactical_intelligence: 94.3,
    spatial_intelligence: 91.8,

    // Team Impact
    team_elevation_effect: 90.1,
    passing_options_created: 93.2,
    intelligent_defensive_work: 88.7,

    // Defensive Metrics
    defensive_transition_reaction: 86.4,
    press_success_rate: 84.2,
    clutch_mentality: 89.7,
    consistency_score: 87.9,

    // Passing Metrics
    short_passing_completion: 95.4,
    under_pressure_passing: 88.9,
    progressive_passes_per90: 8.7,
    passes_into_final_third_per90: 6.3,

    // Ball Control
    first_touch_quality: 93.2,
    first_touch_success_rate: 94.8,
    ball_retention_score: 91.7,
    dribbling_success_rate: 82.6,

    // Shooting Metrics
    shot_frequency_per90: 2.8,
    shot_accuracy: 38.4,
    goals_per90: 0.4,
    goals_vs_xg: 0.9,

    // Positioning & Movement
    defensive_third_percentage: 28.7,
    middle_third_percentage: 52.3,
    attacking_third_percentage: 19.0,
    positional_balance: 89.4,
    pocket_finding_ability: 91.2,
    space_creation: 87.6,
    link_up_positioning: 92.8,

    // Defensive Positioning
    defensive_positioning: 86.9,
    covers_passing_lanes_success: 84.7,
    appropriate_movement_transitions: 89.3,

    // Pressing & Intensity
    press_frequency: 22.8,
    press_intensity: 88.4,
    running_iq: 92.7,
    reaction_speed: 90.1,

    // Transition Intelligence
    transition_iq: 91.4,
    exploits_counter_attacks_success: 86.2,
    transition_quality: 89.8,

    // Physical Metrics
    total_distance_covered: 12560.8,
    high_speed_running_distance: 2150.6,
    sprint_distance: 780.3,
    max_speed: 32.8,
    fatigue_resistance: 88.3,
    sprint_maintenance: 85.7,
    stamina_index: 89.2,

    // Load & Recovery
    acwr_ratio: 1.1,
    injury_risk: 8.7,
    movement_asymmetry: 2.4,
    recovery_status: 92.6,

    // Physical Projections
    physical_maturity: 85.2,
    max_speed_projection: 34.2,
    sprint_capacity_projection: 820.7,
    total_endurance_projection: 13200.4,
    physical_ceiling: 87.9,

    // Consistency & Resilience
    match_to_match_sd: 4.8,
    worst_match_rating: 81.3,
    best_match_rating: 96.2,
    floor_quality: 82.7,
    within_match_variation: 6.2,
    performance_after_mistakes: 88.4,
    resilience_index: 89.7,

    // Big Game Performance
    performance_after_opponent_goal: 87.2,
    leadership_response: 85.9,
    high_stakes_performance: 89.3,
    big_game_player_index: 87.8,
    final_15_minutes_performance: 88.7,
    clutch_performance_rating: 88.9,

    // Decision Making
    pass_selection_quality: 93.8,
    decision_making_score: 92.8,
    calculated_risks_per_match: 5.2,
    unnecessary_risks_per_match: 0.8,
    risk_reward_balance: 91.4,
    game_intelligence: 93.7,

    // Leadership & Communication
    on_field_communication: 88.4,
    vocal_leadership: 84.2,
    leadership_score: 88.9,
    captain_potential: 86.3,
  },

  "player-003": {
    // Core Talent Metrics
    talent_index_score: 93.4,
    current_ability: 91.8,
    growth_trajectory: 85.2,

    // Technical Proficiency
    technical_proficiency: 94.7,
    tactical_intelligence: 95.1,
    spatial_intelligence: 93.8,

    // Team Impact
    team_elevation_effect: 92.8,
    passing_options_created: 96.2,
    intelligent_defensive_work: 91.4,

    // Defensive Metrics
    defensive_transition_reaction: 89.7,
    press_success_rate: 87.3,
    clutch_mentality: 92.6,
    consistency_score: 91.2,

    // Passing Metrics
    short_passing_completion: 97.1,
    under_pressure_passing: 92.4,
    progressive_passes_per90: 9.8,
    passes_into_final_third_per90: 7.4,

    // Ball Control
    first_touch_quality: 95.8,
    first_touch_success_rate: 96.3,
    ball_retention_score: 94.2,
    dribbling_success_rate: 86.9,

    // Shooting Metrics
    shot_frequency_per90: 3.6,
    shot_accuracy: 45.2,
    goals_per90: 0.7,
    goals_vs_xg: 1.2,

    // Positioning & Movement
    defensive_third_percentage: 18.9,
    middle_third_percentage: 58.7,
    attacking_third_percentage: 22.4,
    positional_balance: 92.7,
    pocket_finding_ability: 94.3,
    space_creation: 90.8,
    link_up_positioning: 95.1,

    // Defensive Positioning
    defensive_positioning: 88.4,
    covers_passing_lanes_success: 87.2,
    appropriate_movement_transitions: 92.6,

    // Pressing & Intensity
    press_frequency: 20.4,
    press_intensity: 89.7,
    running_iq: 94.8,
    reaction_speed: 92.3,

    // Transition Intelligence
    transition_iq: 93.9,
    exploits_counter_attacks_success: 89.4,
    transition_quality: 92.7,

    // Physical Metrics
    total_distance_covered: 11870.3,
    high_speed_running_distance: 1980.7,
    sprint_distance: 720.4,
    max_speed: 33.6,
    fatigue_resistance: 86.9,
    sprint_maintenance: 84.2,
    stamina_index: 87.4,

    // Load & Recovery
    acwr_ratio: 1.0,
    injury_risk: 6.3,
    movement_asymmetry: 1.9,
    recovery_status: 94.8,

    // Physical Projections
    physical_maturity: 88.7,
    max_speed_projection: 34.8,
    sprint_capacity_projection: 780.9,
    total_endurance_projection: 12800.6,
    physical_ceiling: 89.1,

    // Consistency & Resilience
    match_to_match_sd: 3.9,
    worst_match_rating: 85.7,
    best_match_rating: 97.8,
    floor_quality: 86.4,
    within_match_variation: 5.1,
    performance_after_mistakes: 91.8,
    resilience_index: 92.4,

    // Big Game Performance
    performance_after_opponent_goal: 90.7,
    leadership_response: 88.3,
    high_stakes_performance: 92.1,
    big_game_player_index: 90.4,
    final_15_minutes_performance: 91.6,
    clutch_performance_rating: 91.9,

    // Decision Making
    pass_selection_quality: 95.2,
    decision_making_score: 94.7,
    calculated_risks_per_match: 4.9,
    unnecessary_risks_per_match: 0.6,
    risk_reward_balance: 93.8,
    game_intelligence: 95.3,

    // Leadership & Communication
    on_field_communication: 90.7,
    vocal_leadership: 86.9,
    leadership_score: 91.2,
    captain_potential: 89.4,
  },

  "player-004": {
    // Core Talent Metrics
    talent_index_score: 85.7,
    current_ability: 87.9,
    growth_trajectory: 82.1,

    // Technical Proficiency
    technical_proficiency: 83.4,
    tactical_intelligence: 88.2,
    spatial_intelligence: 86.7,

    // Team Impact
    team_elevation_effect: 84.9,
    passing_options_created: 79.8,
    intelligent_defensive_work: 89.3,

    // Defensive Metrics
    defensive_transition_reaction: 90.8,
    press_success_rate: 85.7,
    clutch_mentality: 83.6,
    consistency_score: 86.4,

    // Passing Metrics
    short_passing_completion: 89.3,
    under_pressure_passing: 84.2,
    progressive_passes_per90: 3.2,
    passes_into_final_third_per90: 2.1,

    // Ball Control
    first_touch_quality: 84.7,
    first_touch_success_rate: 86.9,
    ball_retention_score: 87.4,
    dribbling_success_rate: 72.8,

    // Shooting Metrics
    shot_frequency_per90: 0.8,
    shot_accuracy: 28.4,
    goals_per90: 0.1,
    goals_vs_xg: 0.8,

    // Positioning & Movement
    defensive_third_percentage: 65.8,
    middle_third_percentage: 28.4,
    attacking_third_percentage: 5.8,
    positional_balance: 87.9,
    pocket_finding_ability: 82.4,
    space_creation: 79.3,
    link_up_positioning: 83.7,

    // Defensive Positioning
    defensive_positioning: 91.2,
    covers_passing_lanes_success: 89.8,
    appropriate_movement_transitions: 86.4,

    // Pressing & Intensity
    press_frequency: 15.7,
    press_intensity: 83.9,
    running_iq: 86.2,
    reaction_speed: 88.7,

    // Transition Intelligence
    transition_iq: 84.2,
    exploits_counter_attacks_success: 78.6,
    transition_quality: 82.9,

    // Physical Metrics
    total_distance_covered: 10890.6,
    high_speed_running_distance: 1620.8,
    sprint_distance: 520.3,
    max_speed: 31.4,
    fatigue_resistance: 89.7,
    sprint_maintenance: 86.3,
    stamina_index: 88.1,

    // Load & Recovery
    acwr_ratio: 0.9,
    injury_risk: 15.8,
    movement_asymmetry: 4.7,
    recovery_status: 85.3,

    // Physical Projections
    physical_maturity: 91.4,
    max_speed_projection: 32.8,
    sprint_capacity_projection: 580.4,
    total_endurance_projection: 11500.2,
    physical_ceiling: 86.7,

    // Consistency & Resilience
    match_to_match_sd: 7.4,
    worst_match_rating: 74.2,
    best_match_rating: 89.7,
    floor_quality: 76.8,
    within_match_variation: 9.8,
    performance_after_mistakes: 84.2,
    resilience_index: 83.7,

    // Big Game Performance
    performance_after_opponent_goal: 82.9,
    leadership_response: 81.4,
    high_stakes_performance: 83.8,
    big_game_player_index: 82.6,
    final_15_minutes_performance: 84.7,
    clutch_performance_rating: 83.2,

    // Decision Making
    pass_selection_quality: 85.7,
    decision_making_score: 86.9,
    calculated_risks_per_match: 2.4,
    unnecessary_risks_per_match: 1.8,
    risk_reward_balance: 84.3,
    game_intelligence: 87.4,

    // Leadership & Communication
    on_field_communication: 86.2,
    vocal_leadership: 83.7,
    leadership_score: 85.8,
    captain_potential: 82.1,
  },
};

// Category groupings for organized display
export const metricsCategories = {
  core: [
    "talent_index_score",
    "current_ability",
    "growth_trajectory",
    "technical_proficiency",
    "tactical_intelligence",
    "spatial_intelligence",
  ],

  teamImpact: [
    "team_elevation_effect",
    "passing_options_created",
    "intelligent_defensive_work",
  ],

  technical: [
    "short_passing_completion",
    "under_pressure_passing",
    "progressive_passes_per90",
    "first_touch_quality",
    "dribbling_success_rate",
    "ball_retention_score",
  ],

  physical: [
    "total_distance_covered",
    "high_speed_running_distance",
    "max_speed",
    "fatigue_resistance",
    "stamina_index",
  ],

  mental: [
    "decision_making_score",
    "game_intelligence",
    "clutch_mentality",
    "resilience_index",
    "leadership_score",
  ],

  defensive: [
    "defensive_positioning",
    "press_success_rate",
    "covers_passing_lanes_success",
    "defensive_transition_reaction",
  ],
};

// Get category label for display
export const getCategoryLabel = (category) => {
  const labels = {
    core: "Core Talent Metrics",
    teamImpact: "Team Impact",
    technical: "Technical Skills",
    physical: "Physical Attributes",
    mental: "Mental Attributes",
    defensive: "Defensive Capabilities",
  };
  return labels[category] || category;
};

// Get readable metric names
export const getMetricLabel = (metricKey) => {
  const labels = {
    talent_index_score: "Talent Index Score",
    current_ability: "Current Ability",
    growth_trajectory: "Growth Trajectory",
    technical_proficiency: "Technical Proficiency",
    tactical_intelligence: "Tactical Intelligence",
    spatial_intelligence: "Spatial Intelligence",
    team_elevation_effect: "Team Elevation Effect",
    passing_options_created: "Passing Options Created",
    intelligent_defensive_work: "Intelligent Defensive Work",
    short_passing_completion: "Short Pass Completion %",
    under_pressure_passing: "Under Pressure Passing",
    progressive_passes_per90: "Progressive Passes per 90",
    first_touch_quality: "First Touch Quality",
    dribbling_success_rate: "Dribbling Success Rate",
    ball_retention_score: "Ball Retention Score",
    total_distance_covered: "Total Distance Covered (m)",
    high_speed_running_distance: "High Speed Running (m)",
    max_speed: "Max Speed (km/h)",
    fatigue_resistance: "Fatigue Resistance",
    stamina_index: "Stamina Index",
    decision_making_score: "Decision Making Score",
    game_intelligence: "Game Intelligence",
    clutch_mentality: "Clutch Mentality",
    resilience_index: "Resilience Index",
    leadership_score: "Leadership Score",
    defensive_positioning: "Defensive Positioning",
    press_success_rate: "Press Success Rate",
    covers_passing_lanes_success: "Passing Lane Coverage",
    defensive_transition_reaction: "Defensive Transition",
  };

  return (
    labels[metricKey] ||
    metricKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};
