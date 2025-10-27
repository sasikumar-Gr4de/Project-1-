import AnalysisWorksService from "../services/AnalysisWorksService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class AnalysisWorksController {
  async createAnalysisWork(req, res) {
    try {
      const result = await AnalysisWorksService.createAnalysisWork(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAnalysisWork(req, res) {
    try {
      const { id } = req.params;
      const result = await AnalysisWorksService.getAnalysisWorkById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllAnalysisWorks(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await AnalysisWorksService.getAllAnalysisWorks(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateAnalysisWork(req, res) {
    try {
      const { id } = req.params;
      const result = await AnalysisWorksService.updateAnalysisWork(
        id,
        req.body
      );
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteAnalysisWork(req, res) {
    try {
      const { id } = req.params;
      const result = await AnalysisWorksService.deleteAnalysisWork(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAnalysisWorkByMatch(req, res) {
    try {
      const { matchId } = req.params;
      const result = await AnalysisWorksService.getAnalysisWorkByMatchId(
        matchId
      );
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAnalysisWorksByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const result = await AnalysisWorksService.getAnalysisWorksByUserId(
        userId,
        {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        }
      );
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateAnalysisWorkStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await AnalysisWorksService.updateAnalysisWorkStatus(
        id,
        status
      );
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateAnalysisWorkProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const result = await AnalysisWorksService.updateAnalysisWorkProgress(
        id,
        progress
      );
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new AnalysisWorksController();
