import Club from "../models/Club.js";
import { generateResponse } from "../utils/helpers.js";
import {
  CLUB_CREATE_SUCCESS,
  CLUB_GET_SUCCESS,
  CLUB_UPDATE_SUCCESS,
  CLUB_DELETE_SUCCESS,
  CLUB_NOT_FOUND,
  CLUB_PLAYERS_GET_SUCCESS,
  COMMON_GET_SUCCESS,
  COMMON_UPDATE_SUCCESS,
  COMMON_DELETE_SUCCESS,
} from "../utils/messages.js";

class ClubsService {
  static async createClub(clubData) {
    try {
      const data = await Club.create(clubData);
      return generateResponse(data, CLUB_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getClubById(id) {
    try {
      const data = await Club.findById(id);
      if (!data) {
        return generateResponse(null, CLUB_NOT_FOUND);
      }
      return generateResponse(data, CLUB_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllClubs(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await Club.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateClub(id, updateData) {
    try {
      const data = await Club.update(id, updateData);
      if (!data) {
        return generateResponse(null, CLUB_NOT_FOUND);
      }
      return generateResponse(data, CLUB_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteClub(id) {
    try {
      const data = await Club.delete(id);
      return generateResponse(data, CLUB_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getClubPlayers(clubId, pagination = { page: 1, pageSize: 10 }) {
    try {
      const data = await Club.findClubPlayers(clubId, pagination);
      return generateResponse(data, CLUB_PLAYERS_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default ClubsService;
