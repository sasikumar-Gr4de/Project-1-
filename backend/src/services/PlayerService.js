import { Player } from "../models/Player.model.js";

export class PlayerService {
  static async createPlayer(playerData, userId) {
    try {
      // Validate required fields
      if (
        !playerData.name ||
        !playerData.date_of_birth ||
        !playerData.primary_position
      ) {
        throw new Error(
          "Name, date of birth, and primary position are required"
        );
      }

      const player = await Player.create(playerData, userId);
      return {
        success: true,
        data: player,
        message: "Player created successfully",
      };
    } catch (error) {
      console.error("PlayerService - createPlayer error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to create player",
      };
    }
  }

  static async getPlayerById(playerId) {
    try {
      const player = await Player.findById(playerId);

      if (!player) {
        return {
          success: false,
          error: "Player not found",
          message: "Player not found",
        };
      }

      return {
        success: true,
        data: player,
        message: "Player retrieved successfully",
      };
    } catch (error) {
      console.error("PlayerService - getPlayerById error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve player",
      };
    }
  }

  static async getAllPlayers(filters = {}, pagination = {}) {
    try {
      const result = await Player.findAll(filters, pagination);

      return {
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          hasMore: result.hasMore,
        },
        message: "Players retrieved successfully",
      };
    } catch (error) {
      console.error("PlayerService - getAllPlayers error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve players",
      };
    }
  }

  static async updatePlayer(playerId, updateData) {
    try {
      const player = await Player.update(playerId, updateData);

      return {
        success: true,
        data: player,
        message: "Player updated successfully",
      };
    } catch (error) {
      console.error("PlayerService - updatePlayer error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to update player",
      };
    }
  }

  static async deletePlayer(playerId) {
    try {
      const result = await Player.delete(playerId);

      return {
        success: true,
        data: result,
        message: "Player deleted successfully",
      };
    } catch (error) {
      console.error("PlayerService - deletePlayer error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to delete player",
      };
    }
  }

  static async getPlayerStatistics() {
    try {
      const stats = await Player.getPlayerStats();

      return {
        success: true,
        data: stats,
        message: "Player statistics retrieved successfully",
      };
    } catch (error) {
      console.error("PlayerService - getPlayerStatistics error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve player statistics",
      };
    }
  }

  static async getFilterOptions() {
    try {
      const [clubs, nationalities] = await Promise.all([
        Player.getClubs(),
        Player.getNationalities(),
      ]);

      const positions = [
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
      const statuses = ["active", "injured", "suspended", "released"];
      const preferredFeet = ["Left", "Right", "Both"];

      return {
        success: true,
        data: {
          clubs,
          nationalities,
          positions,
          statuses,
          preferredFeet,
        },
        message: "Filter options retrieved successfully",
      };
    } catch (error) {
      console.error("PlayerService - getFilterOptions error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve filter options",
      };
    }
  }

  static async importPlayers(playersData, userId) {
    try {
      const results = {
        successful: [],
        failed: [],
      };

      for (const playerData of playersData) {
        try {
          const player = await Player.create(playerData, userId);
          results.successful.push({
            name: playerData.name,
            id: player.id,
          });
        } catch (error) {
          results.failed.push({
            name: playerData.name,
            error: error.message,
          });
        }
      }

      return {
        success: true,
        data: results,
        message: `Import completed: ${results.successful.length} successful, ${results.failed.length} failed`,
      };
    } catch (error) {
      console.error("PlayerService - importPlayers error:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to import players",
      };
    }
  }
}

export default PlayerService;
