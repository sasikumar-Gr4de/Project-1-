import ClubsService from "../services/ClubsService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class ClubsController {
  async createClub(req, res) {
    try {
      const result = await ClubsService.createClub(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getClub(req, res) {
    try {
      const { id } = req.params;
      const result = await ClubsService.getClubById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllClubs(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await ClubsService.getAllClubs(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateClub(req, res) {
    try {
      const { id } = req.params;
      const result = await ClubsService.updateClub(id, req.body);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteClub(req, res) {
    try {
      const { id } = req.params;
      const result = await ClubsService.deleteClub(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getClubPlayers(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await ClubsService.getClubPlayers(id, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new ClubsController();
