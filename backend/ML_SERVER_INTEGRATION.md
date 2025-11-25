# ML Server Integration - Response Structure

## 📋 Overview

This document defines the JSON structure that the **ML Server must send to the backend** after analyzing a player's video. The response includes general metrics and **position-specific metrics**.

## 🎯 Supported Positions

- **Striker / Forward**
- **Midfielder**
- **Defender**
- **Goalkeeper**

## 📊 Base Response Structure

```json
{
  "status": "success",
  "timestamp": "2025-11-24T15:30:00Z",
  "processing_time_ms": 12450,
  "data": {
    "job_id": "uuid",
    "player_data_id": "uuid",
    "player_id": "uuid",
    "match_metadata": { ... },
    "scoring_metrics": {
      "gr4de_score": 85.0,
      "pillars": {
        "technical": 92.0,
        "tactical": 78.5,
        "physical": 88.0,
        "mental": 85.5
      },
      "tempo": {
        "index": 82.0,
        "consistency": 88.5
      }
    },
    "technical_metrics": { ... },
    "tactical_metrics": { ... },
    "physical_metrics": { ... },
    "mental_metrics": { ... },
    "tempo_results": { ... },
    "position_specific_metrics": { ... },
    "benchmark_comparison": { ... },
    "insights": [ ... ],
    "raw_file_urls": {
      "video_annotated": "s3://...",
      "events_csv": "s3://...",
      "detections_csv": "s3://..."
    }
  },
  "metadata": {
    "model_version": "gr4de-v2.1.0",
    "confidence_score": 0.94
  }
}
```

## ⚽ Position-Specific Metrics

### STRIKER

```json
{
  "position_specific_metrics": {
    "position": "striker",
    "striker_metrics": {
      "finishing": {
        "touches_in_final_third": 38,
        "touches_in_penalty_box": 15,

        // Inside the box
        "shots_inside_box": 5,
        "on_target_inside_box": 3,
        "goals_inside_box": 2,
        "off_target_inside_box": 2,

        // Outside the box
        "shots_outside_box": 1,
        "on_target_outside_box": 1,
        "goals_outside_box": 0,
        "off_target_outside_box": 0,

        // Headers
        "headers_attempted": 2,
        "headers_on_target": 1,
        "headers_goals": 1,
        "headers_off_target": 1
      },
      "striker_movement": {
        "runs_in_behind": 12,
        "successful_runs_in_behind": 8,
        "movement_effectiveness": 75.0
      }
    }
  }
}
```

**Key Metrics for Striker:**
- Touches in final third / penalty box
- Shots inside/outside box (on target, off target, goals)
- Headers (on target, off target, goals)
- Movement effectiveness
- Link-up play success

### MIDFIELDER

```json
{
  "position_specific_metrics": {
    "position": "midfielder",
    "midfielder_metrics": {
      "passing_distribution": {
        // Forward passes
        "total_forward_passes": 35,
        "successful_forward_passes": 28,
        "forward_pass_accuracy": 80.0,

        // Lateral passes
        "total_lateral_passes": 28,
        "successful_lateral_passes": 25,
        "lateral_pass_accuracy": 89.3,

        // Pass distances
        "avg_pass_distance_m": 18.5,
        "short_passes": 42,
        "long_passes": 11
      },
      "transition_play": {
        "defensive_to_offensive_transitions": 12,
        "avg_short_passes_defense_to_attack": 4.2,
        "long_passes_defense_to_attack": 8
      },
      "tempo_control": {
        "match_tempo_index": 88.0,
        "tempo_consistency": 92.5
      }
    }
  }
}
```

**Key Metrics for Midfielder:**
- Forward/lateral pass accuracy
- Progressive passes & carries
- Match tempo control
- Defense-to-attack transitions
- Average pass distance
- Ball recoveries & interceptions

### DEFENDER

```json
{
  "position_specific_metrics": {
    "position": "defender",
    "defender_metrics": {
      "defensive_actions": {
        "crucial_tackles": 3,
        "successful_tackles": 5,
        "unsuccessful_tackles": 1,
        "tackle_success_rate": 83.3,

        "simple_interceptions": 4,
        "simple_clearances": 12,
        "blocks": 2,
        "shots_intercepted": 1
      },
      "pressing": {
        "key_presses": 8,
        "successful_presses": 6,
        "unsuccessful_presses": 2,
        "press_success_rate": 75.0
      },
      "threat_prevention": {
        "shots_allowed_from_through_balls": 1,
        "defensive_errors": 0,
        "last_man_tackles": 1
      }
    }
  }
}
```

**Key Metrics for Defender:**
- Crucial/successful/unsuccessful tackles
- Simple interceptions & clearances
- Blocks & shots intercepted
- Key press success rate
- Shots allowed from through balls
- Aerial duels won

### GOALKEEPER

```json
{
  "position_specific_metrics": {
    "position": "goalkeeper",
    "goalkeeper_metrics": {
      "shot_stopping": {
        "simple_saves": 4,
        "brilliant_saves": 2,
        "key_saves": 1,
        "save_percentage": 85.7,
        "goals_conceded": 1,
        "xg_prevented": 1.2
      },
      "crosses_handling": {
        "crosses_faced": 8,
        "crosses_collected": 5,
        "cross_collection_rate": 62.5
      },
      "distribution": {
        "goalkeeper_short_passes": 25,
        "goalkeeper_long_passes": 18,
        "short_pass_accuracy": 88.0,
        "long_pass_accuracy": 66.7,
        "successful_distribution": 38,
        "distribution_success_rate": 88.4
      }
    }
  }
}
```

**Key Metrics for Goalkeeper:**
- Simple/brilliant/key saves
- Save percentage
- Goals conceded
- Crosses faced/collected
- Distribution (short/long passes accuracy)
- Command of area

## 🔄 Integration Flow

```
1. Backend receives video upload
   ↓
2. Creates job in processing_queue
   ↓
3. ML Server receives request
   ↓
4. ML Server processes:
   - Executes CV pipeline (YOLOv11x + tracking)
   - Calculates general metrics
   - Calculates position-specific metrics
   - Generates GR4DE Score
   ↓
5. ML Server sends response with complete structure
   ↓
6. Backend stores:
   - player_metrics (per-match metrics)
   - player_reports (full report)
   - Updates processing_queue → completed
   ↓
7. Backend notifies user
```

## 📁 Reference Files

- `backend/schemas/ml-server-response.schema.json` - Complete JSON Schema
- `backend/schemas/ml-response-examples.js` - Complete examples per position
- `backend/schemas/mlServerResponse.schema.js` - Zod validation

## 🛠️ Backend Implementation

### 1. Validate Response

```javascript
import { validateMLServerResponse } from './schemas/mlServerResponse.schema.js';

// In callback handler
const result = validateMLServerResponse(mlServerData);
if (!result.success) {
  console.error('Invalid ML response:', result.error);
  throw new Error('Invalid ML Server response');
}
```

### 2. Store in Database

```javascript
// Store scoring metrics
await supabase.from('player_metrics').insert({
  player_id: data.player_id,
  data_id: data.player_data_id,
  metric_type: 'overall',
  metric_name: 'gr4de_score',
  metric_value: data.scoring_metrics.gr4de_score,
  percentile: data.benchmark_comparison.percentiles.overall_score
});

// Store position-specific metrics
const posMetrics = data.position_specific_metrics;
if (posMetrics.position === 'striker') {
  // Store finishing metrics
  await supabase.from('player_metrics').insert({
    player_id: data.player_id,
    metric_type: 'position_specific',
    metric_name: 'goals_inside_box',
    metric_value: posMetrics.striker_metrics.finishing.goals_inside_box
  });
}
```

### 3. Generate Player Report

```javascript
await supabase.from('player_reports').insert({
  player_id: data.player_id,
  data_id: data.player_data_id,
  gr4de_score: data.scoring_metrics.gr4de_score,
  tempo_index: data.tempo_results.tempo_index,
  report_data: {
    scoring_metrics: data.scoring_metrics,
    position_specific: data.position_specific_metrics,
    benchmarks: data.benchmark_comparison,
    insights: data.insights
  },
  match_date: data.match_metadata.match_date
});
```

## 🎯 Next Steps

1. **ML Team**: Implement position-specific metrics calculation
2. **Backend Team**: Update callback handler to store metrics
3. **Frontend Team**: Display position-specific metrics in Player Passport

## 📊 Season Storage

Metrics accumulate per season in `player_metrics`:

```sql
-- Query metrics per season
SELECT
  metric_name,
  AVG(metric_value) as season_avg,
  COUNT(*) as matches_played
FROM player_metrics
WHERE player_id = 'uuid'
  AND created_at >= '2024-08-01'
  AND created_at <= '2025-05-31'
GROUP BY metric_name;
```

---

**Version**: 1.0.0
**Date**: 2025-11-25
**Author**: GR4DE Team
