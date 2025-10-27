import EventsTempService from "../services/EventsTempService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class EventsTempController {
  async createEvent(req, res) {
    try {
      const result = await EventsTempService.createEvent(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async createBulkEvents(req, res) {
    try {
      const result = await EventsTempService.createBulkEvents(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventsTempService.getEventById(id);
      if (result.success === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getAllEvents(req, res) {
    try {
      const { page = 1, pageSize = 10, ...filters } = req.query;
      const result = await EventsTempService.getAllEvents(filters, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventsTempService.updateEvent(id, req.body);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await EventsTempService.deleteEvent(id);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getEventsByMatch(req, res) {
    try {
      const { matchId } = req.params;
      const { page = 1, pageSize = 50 } = req.query;
      const result = await EventsTempService.getEventsByMatchId(matchId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getEventsByPlayer(req, res) {
    try {
      const { playerId } = req.params;
      const { page = 1, pageSize = 50 } = req.query;
      const result = await EventsTempService.getEventsByPlayerId(playerId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getEventsByMatchAndPlayer(req, res) {
    try {
      const { matchId, playerId } = req.params;
      const result = await EventsTempService.getEventsByMatchAndPlayer(
        matchId,
        playerId
      );
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteEventsByMatch(req, res) {
    try {
      const { matchId } = req.params;
      const result = await EventsTempService.deleteEventsByMatchId(matchId);
      if (result.success === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new EventsTempController();
