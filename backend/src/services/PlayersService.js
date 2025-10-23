import Player from "../models/Player.js";
import { generateResponse } from "../utils/helpers.js";
import {
  PLAYER_CREATE_SUCCESS,
  PLAYER_GET_SUCCESS,
  PLAYER_UPDATE_SUCCESS,
  PLAYER_DELETE_SUCCESS,
  PLAYER_NOT_FOUND,
  PLAYER_CLUB_GET_SUCCESS,
  COMMON_GET_SUCCESS,
} from "../utils/messages.js";

class PlayersService {
  static async createPlayer(playerData) {
    try {
      const data = await Player.create(playerData);
      return generateResponse(data, PLAYER_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getPlayerById(id) {
    try {
      const data = await Player.findById(id);
      if (!data) {
        return generateResponse(null, PLAYER_NOT_FOUND);
      }
      return generateResponse(data, PLAYER_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllPlayers(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await Player.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updatePlayer(id, updateData) {
    try {
      const data = await Player.update(id, updateData);
      if (!data) {
        return generateResponse(null, PLAYER_NOT_FOUND);
      }
      return generateResponse(data, PLAYER_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deletePlayer(id) {
    try {
      const data = await Player.delete(id);
      return generateResponse(data, PLAYER_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getPlayerClub(playerId) {
    try {
      const data = await Player.findPlayerClubName(playerId);
      if (!data) {
        return generateResponse(null, PLAYER_NOT_FOUND);
      }
      return generateResponse(data, PLAYER_CLUB_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default PlayersService;
