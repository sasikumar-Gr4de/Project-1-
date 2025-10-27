// src/controllers/MatchInfoController.js
import MatchInfoService from "../services/MatchInfoService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class MatchInfoController {
  async createMatchInfo(req, res) {
    try {
      const result = await MatchInfoService.createMatchInfo(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  // Add this new method for bulk creation
  async createBulkMatchInfo(req, res) {
    try {
      const { match_id, players } = req.body;

      if (!match_id || !players || !Array.isArray(players)) {
        return res.status(400).json({
          success: false,
          message: "Match ID and players array are required",
        });
      }

      const result = await MatchInfoService.createBulkMatchInfo(
        match_id,
        players
      );
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatchInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchInfoService.getMatchInfoById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllMatchInfo(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await MatchInfoService.getAllMatchInfo(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateMatchInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchInfoService.updateMatchInfo(id, req.body);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteMatchInfo(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchInfoService.deleteMatchInfo(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatchInfoByMatch(req, res) {
    try {
      const { matchId } = req.params;
      const result = await MatchInfoService.getMatchInfoByMatchId(matchId);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatchInfoByClub(req, res) {
    try {
      const { clubId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await MatchInfoService.getMatchInfoByClubId(clubId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatchInfoByPlayer(req, res) {
    try {
      const { playerId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await MatchInfoService.getMatchInfoByPlayerId(playerId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatchLineup(req, res) {
    try {
      const { matchId } = req.params;
      const result = await MatchInfoService.getMatchLineup(matchId);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updatePlayerEndTime(req, res) {
    try {
      const { id } = req.params;
      const { end_time } = req.body;
      const result = await MatchInfoService.updatePlayerEndTime(id, end_time);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new MatchInfoController();
