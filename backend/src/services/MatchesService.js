import Match from "../models/Match.js";
import { generateResponse } from "../utils/helpers.js";
import {
  MATCH_CREATE_SUCCESS,
  MATCH_GET_SUCCESS,
  MATCH_UPDATE_SUCCESS,
  MATCH_DELETE_SUCCESS,
  MATCH_NOT_FOUND,
  COMMON_GET_SUCCESS,
} from "../utils/messages.js";

class MatchesService {
  static async createMatch(matchData) {
    try {
      const data = await Match.create(matchData);
      return generateResponse(data, MATCH_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchById(id) {
    try {
      const data = await Match.findById(id);
      if (!data) {
        return generateResponse(null, MATCH_NOT_FOUND);
      }
      return generateResponse(data, MATCH_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllMatches(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await Match.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateMatch(id, updateData) {
    try {
      const data = await Match.update(id, updateData);
      if (!data) {
        return generateResponse(null, MATCH_NOT_FOUND);
      }
      return generateResponse(data, MATCH_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteMatch(id) {
    try {
      const data = await Match.delete(id);
      return generateResponse(data, MATCH_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchesByClubId(
    clubId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await Match.findByClubId(clubId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchesByPlayerId(
    playerId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await Match.findByPlayerId(playerId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default MatchesService;
