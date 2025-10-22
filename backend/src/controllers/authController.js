import {
  LoginInputValidation,
  RegisterInputValidation,
} from "../validation/auth.validation.js";
import AuthService from "../services/AuthService.js";
import { sendServerErrorResponse } from "../utils/helpers.js";

class AuthController {
  constructor() {}

  async register(req, res) {
    try {
      // Validation Test
      const { ...userData } = req.body;
      const validation_result = RegisterInputValidation(userData);
      if (validation_result["success"] === false)
        return res.status(400).json(validation_result);

      const result = await AuthService.registerUser(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async login(req, res) {
    try {
      const { ...userData } = req.body;
      const validation_result = LoginInputValidation(userData);
      if (validation_result["success"] === false)
        return res.status(400).json(validation_result);

      const result = await AuthService.loginUser(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      throw err;
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getProfile(req, res) {
    try {
      const result = await AuthService.getProfile(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateProfile(req, res) {
    try {
      const result = await AuthService.updateProfile(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async changePassword(req, res) {
    try {
      const result = await AuthService.changePassword(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async sendVerificationEmail(req, res) {
    try {
      const result = await AuthService.sendVerificationEmail(req, res);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async checkVerificationStatus(req, res) {
    try {
      const result = await AuthService.checkVerificationStatus(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new AuthController();
