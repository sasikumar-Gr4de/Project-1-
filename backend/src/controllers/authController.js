import {
  LoginInputValidation,
  RegisterInputValidation,
} from "../validation/auth.validation";
import AuthService from "../services/AuthService";
import { sendServerErrorResponse } from "../utils/helpers";

class AuthController {
  constructor() {}

  async register(req, res) {
    try {
      // Validation Test
      const { ...userData } = req.body;
      validation_result = RegisterInputValidation(userData);
      if (validataion_result["success"] === false)
        return res.status(400).json(validation_result);

      const result = AuthService.registerUser(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async login(req, res) {
    try {
      const { ...userData } = req.body;
      validation_result = LoginInputValidation(userData);
      if (validataion_result["success"] === false)
        return res.status(400).json(validation_result);

      const result = AuthService.loginUser(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async getProfile(req, res) {
    try {
      const result = AuthService.getProfile(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }

  async updateProfile(req, res) {
    try {
      const result = AuthService.updateProfile(req, res);
      if (result["success"] === false) return res.status(400).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return sendServerErrorResponse(req, res, err);
    }
  }
}

export default new AuthController();
