import * as passportService from "../services/passportService.js";
import * as metricsService from "../services/metricsService.js";
import { RESPONSES } from "../utils/messages.js";

// Get complete passport view
export const getPlayerPassport = async (req, res) => {
  try {
    const { player_id } = req.params;
    const passport = await passportService.getPlayerPassport(player_id);

    res.json(
      RESPONSES.SUCCESS("Player passport fetched successfully", passport)
    );
  } catch (error) {
    console.error("Get player passport error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch player passport"));
  }
};

// Create/update player identity
export const updatePlayerIdentity = async (req, res) => {
  try {
    const { player_id } = req.params;
    const identityData = req.body;

    const identity = await passportService.updatePlayerIdentity(
      player_id,
      identityData
    );

    res.json(
      RESPONSES.SUCCESS("Player identity updated successfully", identity)
    );
  } catch (error) {
    console.error("Update player identity error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to update player identity"));
  }
};

// Ingest player metrics
export const ingestPlayerMetrics = async (req, res) => {
  try {
    const { player_id } = req.params;
    const metricsData = req.body;

    const metric = await passportService.ingestPlayerMetrics(
      player_id,
      metricsData
    );

    res.json(RESPONSES.SUCCESS("Player metrics ingested successfully", metric));
  } catch (error) {
    console.error("Ingest player metrics error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to ingest player metrics"));
  }
};

// Get player metrics with date range
export const getPlayerMetrics = async (req, res) => {
  try {
    const { player_id } = req.params;
    const { from, to } = req.query;

    const metrics = await passportService.getPlayerMetrics(player_id, {
      from,
      to,
    });

    res.json(RESPONSES.SUCCESS("Player metrics fetched successfully", metrics));
  } catch (error) {
    console.error("Get player metrics error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch player metrics"));
  }
};

// Get metrics summary
export const getMetricsSummary = async (req, res) => {
  try {
    const { player_id } = req.params;
    const { period = "4weeks" } = req.query;

    const summary = await metricsService.getMetricsSummary(player_id, period);

    res.json(
      RESPONSES.SUCCESS("Metrics summary fetched successfully", summary)
    );
  } catch (error) {
    console.error("Get metrics summary error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch metrics summary"));
  }
};

// Upload verification document
export const uploadVerificationDocument = async (req, res) => {
  try {
    const { player_id } = req.params;
    const documentData = req.body;

    const verification = await passportService.uploadVerificationDocument(
      player_id,
      documentData
    );

    res.json(
      RESPONSES.SUCCESS(
        "Verification document uploaded successfully",
        verification
      )
    );
  } catch (error) {
    console.error("Upload verification document error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to upload verification document"));
  }
};
