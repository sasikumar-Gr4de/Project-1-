import {
  CreateUserInputValidation,
  UpdateUserInputValidation,
} from "../validation/user.validation.js";
import UserService from "../services/UsersService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class UserController {
  constructor() {}

  async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        pageSize = 10,
        role,
        client_type,
        is_active,
      } = req.query;

      const filters = {};
      if (role) filters.role = role;
      if (client_type) filters.client_type = client_type;
      if (is_active !== undefined)
        filters.is_active = is_active === "true" || is_active === "";

      const pagination = { page: parseInt(page), pageSize: parseInt(pageSize) };

      const result = await UserService.getAllUsers(filters, pagination);

      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.getUserById(id);
      if (result["success"] === false) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const validation_result = UpdateUserInputValidation(updateData);
      if (validation_result["success"] === false)
        return res.status(400).json(validation_result);

      const result = await UserService.updateUser(id, updateData);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async activateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.activateUser(id);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deactivateUser(id);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const pagination = { page: parseInt(page), limit: parseInt(limit) };

      const result = await UserService.getUsersByRole(role, pagination);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getUserReferenceData(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.getUserReferenceData(id);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new UserController();
