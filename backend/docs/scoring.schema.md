```sql
-- Events table to store video analysis output
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  player_data_id UUID NOT NULL,
  player_id UUID NOT NULL,
  action_name TEXT NOT NULL,
  subaction TEXT,
  timestamp TEXT NOT NULL,
  position_x DECIMAL,
  position_y DECIMAL,
  position_x_end DECIMAL,
  position_y_end DECIMAL,
  body_part TEXT,
  shot_type TEXT,
  is_cross BOOLEAN DEFAULT FALSE,
  key_pass BOOLEAN DEFAULT FALSE,
  assist BOOLEAN DEFAULT FALSE,
  under_pressure BOOLEAN DEFAULT FALSE,
  description TEXT,
  special_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_player_data_id_fkey FOREIGN KEY (player_data_id) REFERENCES player_data(id) ON DELETE CASCADE,
  CONSTRAINT events_player_id_fkey FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analysis jobs table to track processing status
CREATE TABLE public.analysis_jobs (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  player_data_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  model_endpoint TEXT NOT NULL,
  request_payload JSONB,
  response_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT analysis_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT analysis_jobs_player_data_id_fkey FOREIGN KEY (player_data_id) REFERENCES player_data(id) ON DELETE CASCADE,
  CONSTRAINT analysis_jobs_status_check CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  )
);

-- Scoring results table
CREATE TABLE public.scoring_results (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  player_data_id UUID NOT NULL,
  player_id UUID NOT NULL,
  passes_completed_p90 DECIMAL,
  pass_completion_rate DECIMAL,
  progressive_passes_p90 DECIMAL,
  xthreat_p90 DECIMAL,
  defensive_actions_p90 DECIMAL,
  overall_score DECIMAL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT scoring_results_pkey PRIMARY KEY (id),
  CONSTRAINT scoring_results_player_data_id_fkey FOREIGN KEY (player_data_id) REFERENCES player_data(id) ON DELETE CASCADE,
  CONSTRAINT scoring_results_player_id_fkey FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
);
```
