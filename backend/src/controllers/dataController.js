import {
  createPlayerData,
  changePlayerDataStatus,
  getAllPlayerDataByPlayerId,
  triggerAnalaysisModel,
} from "../services/dataService.js";
import { createPlayerMetrics } from "../services/metricsService.js";
import { createPlayerReport } from "../services/reportService.js";
import { updateQueueData as updateQueueDataService } from "../services/queueService.js";
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
      // await triggerAnalaysisModel({
      //   player_data_id: data.id,
      //   video_url: data.video_file,
      //   gps_url: data.gps_file,
      //   metadata: data.metadata,
      //   callback_url: `${process.env.SERVER_URL}/api/data/ml/callbacks`,
      // });
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
    const { status, processing_time_ms, data, metadata } = req.body;
    const { player_data_id } = data;

    if (status === "success") {
      await updateQueueDataService(player_data_id, {
        status: "completed",
        completed_at: new Date().toISOString(),
        processing_time_ms: processing_time_ms,
        logs: `Analysis completed successfully at ${new Date().toISOString()}`, // Option for more detailed logs (ML Server)
      });

      // Prepare data for player metrics and report
      data["metadata"] = metadata;
      // Create player metrics
      await createPlayerMetrics(data);

      // Create player report
      await createPlayerReport(data);
      res.json(RESPONSES.SUCCESS("Analysis callback received", data));
    } else if (status === "failed") {
      await changePlayerDataStatus(player_data_id, "failed");
      await updateQueueDataService(player_data_id, {
        status: "failed",
        completed_at: new Date().toISOString(),
        processing_time_ms: processing_time_ms,
        logs: `Analysis failed at ${new Date().toISOString()}`, // Option for more detailed logs (ML Server)
      });
    }
    res.json(RESPONSES.BAD_REQUEST("Analysis callback failed"));
  } catch (error) {
    console.log("Analysis callback error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to process analysis callback"));
  }
};

export const updateQueueData = async (req, res) => {
  try {
    const { player_data_id } = req.params;
    const { data } = req.body;
    const queue = await updateQueueDataService(player_data_id, data);
    res.json(RESPONSES.SUCCESS("Queue data updated successfully", queue));
  } catch (error) {
    console.log("Update queue data error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to update queue data"));
  }
};
