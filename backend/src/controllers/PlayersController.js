import PlayersService from "../services/PlayersService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class PlayersController {
  async createPlayer(req, res) {
    try {
      const result = await PlayersService.createPlayer(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getPlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayersService.getPlayerById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllPlayers(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await PlayersService.getAllPlayers(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updatePlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayersService.updatePlayer(id, req.body);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deletePlayer(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayersService.deletePlayer(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getPlayerClub(req, res) {
    try {
      const { id } = req.params;
      const result = await PlayersService.getPlayerClub(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new PlayersController();
