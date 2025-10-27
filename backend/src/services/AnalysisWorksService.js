import AnalysisWork from "../models/AnalysisWork.js";
import { generateResponse } from "../utils/helpers.js";
import {
  ANALYSIS_WORK_CREATE_SUCCESS,
  ANALYSIS_WORK_GET_SUCCESS,
  ANALYSIS_WORK_UPDATE_SUCCESS,
  ANALYSIS_WORK_DELETE_SUCCESS,
  ANALYSIS_WORK_NOT_FOUND,
  COMMON_GET_SUCCESS,
} from "../utils/messages.js";

class AnalysisWorksService {
  static async createAnalysisWork(analysisWorkData) {
    try {
      const data = await AnalysisWork.create(analysisWorkData);
      return generateResponse(data, ANALYSIS_WORK_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAnalysisWorkById(id) {
    try {
      const data = await AnalysisWork.findById(id);
      if (!data) {
        return generateResponse(null, ANALYSIS_WORK_NOT_FOUND);
      }
      return generateResponse(data, ANALYSIS_WORK_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllAnalysisWorks(
    filters = {},
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await AnalysisWork.findAll(filters, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateAnalysisWork(id, updateData) {
    try {
      const data = await AnalysisWork.update(id, updateData);
      if (!data) {
        return generateResponse(null, ANALYSIS_WORK_NOT_FOUND);
      }
      return generateResponse(data, ANALYSIS_WORK_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteAnalysisWork(id) {
    try {
      const data = await AnalysisWork.delete(id);
      return generateResponse(data, ANALYSIS_WORK_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAnalysisWorkByMatchId(matchId) {
    try {
      const data = await AnalysisWork.findByMatchId(matchId);
      if (!data) {
        return generateResponse(null, ANALYSIS_WORK_NOT_FOUND);
      }
      return generateResponse(data, ANALYSIS_WORK_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAnalysisWorksByUserId(
    userId,
    pagination = { page: 1, pageSize: 10 }
  ) {
    try {
      const result = await AnalysisWork.findByUserId(userId, pagination);
      return generateResponse(result, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateAnalysisWorkStatus(id, status) {
    try {
      const data = await AnalysisWork.updateStatus(id, status);
      if (!data) {
        return generateResponse(null, ANALYSIS_WORK_NOT_FOUND);
      }
      return generateResponse(data, ANALYSIS_WORK_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateAnalysisWorkProgress(id, progress) {
    try {
      const data = await AnalysisWork.updateProgress(id, progress);
      if (!data) {
        return generateResponse(null, ANALYSIS_WORK_NOT_FOUND);
      }
      return generateResponse(data, ANALYSIS_WORK_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }
}

export default AnalysisWorksService;
