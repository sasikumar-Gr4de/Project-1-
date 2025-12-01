import {
  createPlayerData,
  changePlayerDataStatus,
  getAllPlayerDataByPlayerId,
  triggerAnalaysisModel,
  updateQueueData,
} from "../services/dataService.js";
import { RESPONSES } from "../utils/messages.js";

// Create new player data => trigger analysis workflow
export const createData = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const playerData = req.body;
    // Create player data in player_data & processing_queue table
    const data = await createPlayerData(userId, playerData);

    // Trigger analysis model after data creation
    try {
      await triggerAnalaysisModel({
        player_data_id: data.id,
        video_url: data.video_file,
        gps_url: data.gps_file,
        metadata: data.metadata,
        callback_url: `${process.env.SERVER_URL}/api/data/ml/callbacks`,
      });
      console.log("Analysis model triggered successfully");
      console.log("Triggered analysis for player data ID:", data.id);
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

// Get all player data by player ID
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

// Get analysis callback from ML Server
export const getAnalysisCallback = async (req, res) => {
  try {
    const { player_data_id, status, processing_time_ms, data, metadata } =
      req.body;

    if (status === "success") {
      await updateQueueData(player_data_id, {
        status: "completed",
        completed_at: new Date().toISOString(),
        processing_time_ms: processing_time_ms,
        logs: `Analysis completed successfully at ${new Date().toISOString()}`, // Option for more detailed logs (ML Server)
      });
    } else if (status === "failed") {
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

// Update queue data
export const updateQueueData = async (req, res) => {
  try {
    const { queueId } = req.body;
    const { data } = req.body;
    const result = await updateQueueData(queueId, data);
    res.json(RESPONSES.SUCCESS("Queue data updated successfully", result));
  } catch (error) {
    console.log("Update queue data error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to update queue data"));
  }
};
