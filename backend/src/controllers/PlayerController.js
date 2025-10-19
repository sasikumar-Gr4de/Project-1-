import PlayerService from "../services/PlayerService.js";

class PlayerController {
  constructor() {
    this.createPlayer = this.createPlayer.bind(this);
    this.getPlayer = this.getPlayer.bind(this);
    this.getAllPlayers = this.getAllPlayers.bind(this);
    this.updatePlayer = this.updatePlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
    this.getPlayerStats = this.getPlayerStats.bind(this);
    this.getFilterOptions = this.getFilterOptions.bind(this);
    this.importPlayers = this.importPlayers.bind(this);
  }

  async createPlayer(req, res) {
    try {
      const result = await PlayerService.createPlayer(
        req.body,
        req.user.userId
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("PlayerController - createPlayer error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating player",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async getPlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayerService.getPlayerById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - getPlayer error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving player",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async getAllPlayers(req, res) {
    try {
      const result = await PlayerService.getAllPlayers(
        req.filters,
        req.pagination
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - getAllPlayers error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving players",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async updatePlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayerService.updatePlayer(id, req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - updatePlayer error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating player",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async deletePlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayerService.deletePlayer(id);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - deletePlayer error:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting player",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async getPlayerStats(req, res) {
    try {
      const result = await PlayerService.getPlayerStatistics();

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - getPlayerStats error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving player statistics",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async getFilterOptions(req, res) {
    try {
      const result = await PlayerService.getFilterOptions();

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("PlayerController - getFilterOptions error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving filter options",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async importPlayers(req, res) {
    try {
      const { players } = req.body;

      if (!players || !Array.isArray(players) || players.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Players array is required",
        });
      }

      const result = await PlayerService.importPlayers(
        players,
        req.user.userId
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("PlayerController - importPlayers error:", error);
      res.status(500).json({
        success: false,
        message: "Error importing players",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
}

export default new PlayerController();
