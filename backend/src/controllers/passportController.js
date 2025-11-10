import * as passportService from "../services/passportService.js";
import { RESPONSES } from "../utils/messages.js";

// Add missing controller functions
export const createPlayerPassport = async (req, res) => {
  try {
    const { player_id } = req.params;
    const passportData = req.body;
    const passport = await passportService.createPlayerPassport(
      player_id,
      passportData
    );
    res.json(
      RESPONSES.SUCCESS("Player passport created successfully", passport)
    );
  } catch (error) {
    console.error("Create player passport error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to create player passport"));
  }
};

export const updatePlayerPassport = async (req, res) => {
  try {
    const { player_id } = req.params;
    const passportData = req.body;
    const passport = await passportService.updatePlayerPassport(
      player_id,
      passportData
    );
    res.json(
      RESPONSES.SUCCESS("Player passport updated successfully", passport)
    );
  } catch (error) {
    console.error("Update player passport error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to update player passport"));
  }
};

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

export const createPlayerIdentity = async (req, res) => {
  try {
    const { player_id } = req.params;
    const identityData = req.body;
    const identity = await passportService.createPlayerIdentity(
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

export const getVerificationStatus = async (req, res) => {
  try {
    const { player_id } = req.params;
    const status = await passportService.getVerificationStatus(player_id);
    res.json(
      RESPONSES.SUCCESS("Verification status fetched successfully", status)
    );
  } catch (error) {
    console.error("Get verification status error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch verification status"));
  }
};

export const uploadHeadshot = async (req, res) => {
  try {
    const { player_id } = req.params;
    const { headshot_url } = req.body;
    const identity = await passportService.updateHeadshot(
      player_id,
      headshot_url
    );
    res.json(RESPONSES.SUCCESS("Headshot uploaded successfully", identity));
  } catch (error) {
    console.error("Upload headshot error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to upload headshot"));
  }
};

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

export const restartVerification = async (req, res) => {
  try {
    const { player_id } = req.params;
    const result = await passportService.restartVerificationProcess(player_id);

    res.json(
      RESPONSES.SUCCESS("Verification process restarted successfully", result)
    );
  } catch (error) {
    console.error("Restart verification error:", error);
    res
      .status(400)
      .json(
        RESPONSES.BAD_REQUEST(error.message || "Failed to restart verification")
      );
  }
};
