import EventTemp from "../models/EventTemp.js";
import { generateResponse } from "../utils/helpers.js";
import {
  EVENT_CREATE_SUCCESS,
  EVENT_GET_SUCCESS,
  EVENT_UPDATE_SUCCESS,
  EVENT_DELETE_SUCCESS,
  EVENT_NOT_FOUND,
  EVENTS_BULK_CREATE_SUCCESS,
  COMMON_GET_SUCCESS,
} from "../utils/messages.js";

class EventsTempService {
  static async createEvent(eventData) {
    try {
      const data = await EventTemp.create(eventData);
      return generateResponse(data, EVENT_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async createBulkEvents(eventsData) {
    try {
      const data = await EventTemp.createBulk(eventsData);
      return generateResponse(data, EVENTS_BULK_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getEventById(id) {
    try {
      const data = await EventTemp.findById(id);
      if (!data) {
        return generateResponse(null, EVENT_NOT_FOUND);
      }
      return generateResponse(data, EVENT_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllEvents(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await EventTemp.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateEvent(id, updateData) {
    try {
      const data = await EventTemp.update(id, updateData);
      if (!data) {
        return generateResponse(null, EVENT_NOT_FOUND);
      }
      return generateResponse(data, EVENT_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteEvent(id) {
    try {
      const data = await EventTemp.delete(id);
      return generateResponse(data, EVENT_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getEventsByMatchId(
    matchId,
    pagination = { page: 1, pageSize: 50 }
  ) {
    try {
      const result = await EventTemp.findByMatchId(matchId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getEventsByPlayerId(
    playerId,
    pagination = { page: 1, pageSize: 50 }
  ) {
    try {
      const result = await EventTemp.findByPlayerId(playerId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getEventsByMatchAndPlayer(matchId, playerId) {
    try {
      const data = await EventTemp.findByMatchAndPlayer(matchId, playerId);
      return generateResponse(data, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteEventsByMatchId(matchId) {
    try {
      const data = await EventTemp.deleteByMatchId(matchId);
      return generateResponse(data, EVENT_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default EventsTempService;
