// src/services/MatchInfoService.js
import MatchInfo from "../models/MatchInfo.js";
import { generateResponse } from "../utils/helpers.js";
import {
  MATCH_INFO_CREATE_SUCCESS,
  MATCH_INFO_GET_SUCCESS,
  MATCH_INFO_UPDATE_SUCCESS,
  MATCH_INFO_DELETE_SUCCESS,
  MATCH_INFO_NOT_FOUND,
  MATCH_INFO_BULK_CREATE_SUCCESS,
  COMMON_GET_SUCCESS,
} from "../utils/messages.js";

class MatchInfoService {
  static async createMatchInfo(matchInfoData) {
    try {
      const data = await MatchInfo.create(matchInfoData);
      return generateResponse(data, MATCH_INFO_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  // Add this new method for bulk creation
  static async createBulkMatchInfo(matchId, playersData) {
    try {
      // First, delete existing match info for this match to avoid duplicates
      await MatchInfo.deleteByMatchId(matchId);

      // Then create new records
      const data = await MatchInfo.createBulk(playersData);
      return generateResponse(data, MATCH_INFO_BULK_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchInfoById(id) {
    try {
      const data = await MatchInfo.findById(id);
      if (!data) {
        return generateResponse(null, MATCH_INFO_NOT_FOUND);
      }
      return generateResponse(data, MATCH_INFO_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllMatchInfo(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await MatchInfo.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateMatchInfo(id, updateData) {
    try {
      const data = await MatchInfo.update(id, updateData);
      if (!data) {
        return generateResponse(null, MATCH_INFO_NOT_FOUND);
      }
      return generateResponse(data, MATCH_INFO_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateMatchInfo(id, updateData) {
    try {
      const data = await MatchInfo.update(id, updateData);
      if (!data) {
        return generateResponse(null, MATCH_INFO_NOT_FOUND);
      }
      return generateResponse(data, MATCH_INFO_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteMatchInfo(id) {
    try {
      const data = await MatchInfo.delete(id);
      return generateResponse(data, MATCH_INFO_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchInfoByMatchId(matchId) {
    try {
      const data = await MatchInfo.findByMatchId(matchId);
      return generateResponse(data, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchInfoByClubId(
    clubId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await MatchInfo.findByClubId(clubId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchInfoByPlayerId(
    playerId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await MatchInfo.findByPlayerId(playerId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getMatchLineup(matchId) {
    try {
      const data = await MatchInfo.findLineupByMatchId(matchId);
      return generateResponse(data, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updatePlayerEndTime(id, endTime) {
    try {
      const data = await MatchInfo.updateEndTime(id, endTime);
      if (!data) {
        return generateResponse(null, MATCH_INFO_NOT_FOUND);
      }
      return generateResponse(data, MATCH_INFO_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default MatchInfoService;
