import MatchesService from "../services/MatchesService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class MatchesController {
  async createMatch(req, res) {
    try {
      const result = await MatchesService.createMatch(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getMatch(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchesService.getMatchById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllMatches(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await MatchesService.getAllMatches(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateMatch(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchesService.updateMatch(id, req.body);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteMatch(req, res) {
    try {
      const { id } = req.params;
      const result = await MatchesService.deleteMatch(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getClubMatches(req, res) {
    try {
      const { clubId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await MatchesService.getMatchesByClubId(clubId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getPlayerMatches(req, res) {
    try {
      const { playerId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await MatchesService.getMatchesByPlayerId(playerId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new MatchesController();
