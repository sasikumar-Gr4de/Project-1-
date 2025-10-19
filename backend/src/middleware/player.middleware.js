import { Player } from "../models/Player.model.js";

export const validatePlayerOwnership = async (req, res, next) => {
  try {
    const playerId = req.params.id;
    const userId = req.user.userId;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        message: "Player ID is required",
      });
    }

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Check if user is admin or the creator of the player
    if (req.user.role !== "admin" && player.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify players you created.",
      });
    }

    req.player = player;
    next();
  } catch (error) {
    console.error("Player ownership validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating player ownership",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const validatePlayerData = (req, res, next) => {
  const {
    name,
    date_of_birth,
    primary_position,
    height_cm,
    weight_kg,
    preferred_foot,
    status,
    overall_ability,
  } = req.body;

  // Required fields validation
  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Player name is required",
    });
  }

  if (!date_of_birth) {
    return res.status(400).json({
      success: false,
      message: "Date of birth is required",
    });
  }

  if (!primary_position) {
    return res.status(400).json({
      success: false,
      message: "Primary position is required",
    });
  }

  // Position validation
  const validPositions = [
    "GK",
    "CB",
    "LB",
    "RB",
    "CDM",
    "CM",
    "CAM",
    "LW",
    "RW",
    "ST",
  ];
  if (!validPositions.includes(primary_position)) {
    return res.status(400).json({
      success: false,
      message: `Invalid position. Valid positions: ${validPositions.join(
        ", "
      )}`,
    });
  }

  // Height validation
  if (height_cm && (height_cm < 100 || height_cm > 250)) {
    return res.status(400).json({
      success: false,
      message: "Height must be between 100cm and 250cm",
    });
  }

  // Weight validation
  if (weight_kg && (weight_kg < 30 || weight_kg > 150)) {
    return res.status(400).json({
      success: false,
      message: "Weight must be between 30kg and 150kg",
    });
  }

  // Preferred foot validation
  const validFeet = ["Left", "Right", "Both"];
  if (preferred_foot && !validFeet.includes(preferred_foot)) {
    return res.status(400).json({
      success: false,
      message: `Invalid preferred foot. Valid values: ${validFeet.join(", ")}`,
    });
  }

  // Status validation
  const validStatuses = ["active", "injured", "suspended", "released"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
    });
  }

  // Ability validation
  if (overall_ability && (overall_ability < 0 || overall_ability > 100)) {
    return res.status(400).json({
      success: false,
      message: "Overall ability must be between 0 and 100",
    });
  }

  next();
};

export const parsePlayerFilters = (req, res, next) => {
  const {
    search,
    position,
    status,
    club,
    nationality,
    min_ability,
    max_ability,
    page = 1,
    limit = 10,
  } = req.query;

  req.filters = {
    search: search || "",
    primary_position: position,
    status,
    current_club: club,
    nationality,
    min_ability: min_ability ? parseInt(min_ability) : undefined,
    max_ability: max_ability ? parseInt(max_ability) : undefined,
  };

  req.pagination = {
    page: parseInt(page),
    limit: parseInt(limit) > 50 ? 50 : parseInt(limit), // Limit to 50 per page
  };

  next();
};
