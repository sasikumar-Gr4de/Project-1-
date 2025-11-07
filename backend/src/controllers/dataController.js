import {
  createPlayerData,
  changePlayerDataStatus,
  getAllPlayerDataByPlayerId,
  triggerAnalaysisModel,
} from "../services/dataService.js";
import { RESPONSES } from "../utils/messages.js";

// Create new player data => trigger analysis workflow
export const createData = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const playerData = req.body;
    const data = await createPlayerData(userId, playerData);

    // Trigger analysis model after data creation
    try {
      await triggerAnalaysisModel({
        player_data_id: data.id,
        video_url: data.video_file,
        jersey_home_color: data.jersey_home_color,
        jersey_away_color: data.jersey_away_color,
        jersey_number: data.jersey_number,
        position: data.position,
        // gps_url: data.gps_file,
        callback_url: `${process.env.SERVER_URL}/api/data/callbacks`,
      });
    } catch (analysisError) {
      console.log("Analysis model trigger error:", analysisError);
      res
        .status(500)
        .json(RESPONSES.SERVER_ERROR("Failed to trigger analysis model"));
    }

    res.json(RESPONSES.SUCCESS("Player data created successfully", data));
  } catch (error) {
    console.log("Create player data error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to create player data"));
  }
};

// Change player data status
export const changeDataStatus = async (req, res) => {
  try {
    const { dataId } = req.params;
    const { status } = req.body;

    const data = await changePlayerDataStatus(dataId, status);

    if (error) {
      throw new Error("Failed to update player data status");
    }

    res.json(
      RESPONSES.SUCCESS("Player data status updated successfully", data)
    );
  } catch (error) {
    console.log("Change player data status error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to change player data status"));
  }
};

export const getDataByPlayerId = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { pagination } = req.query;
    const data = await getAllPlayerDataByPlayerId(userId, pagination);
    res.json(RESPONSES.SUCCESS("Player data fetched successfully", data));
  } catch (error) {
    console.log("Get player data by player ID error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch player data"));
  }
};

export const getAnalysisCallback = async (req, res) => {
  try {
    const { player_data_id } = req.body;
    const result = {
      player_data_id: player_data_id,
      events: [
        {
          annotated_video_url:
            "https://amzn-gr4de-bucket.s3.amazonaws.com/processed/server1-1/annotated.mp4",
          detections_csv_url:
            "https://amzn-gr4de-bucket.s3.amazonaws.com/processed/server1-1/detections.csv",
          events_csv_url:
            "https://amzn-gr4de-bucket.s3.amazonaws.com/processed/server1-1/events.csv",
        },
      ],
      status: "completed",
      error: "",
    };

    if (result.status === "completed") {
      // Update player data with analysis results
      // Load CSV From URL and Save to Supabase Storage (omitted for brevity)
    } else if (result.status === "failed") {
      await changePlayerDataStatus(player_data_id, "failed");
    }

    res.json(RESPONSES.SUCCESS("Analysis callback received"));
  } catch (error) {
    console.log("Analysis callback error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to process analysis callback"));
  }
};
