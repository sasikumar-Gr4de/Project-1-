import {
  LoginInputValidation,
  RegisterInputValidation,
} from "../validation/auth.validation";
import AuthService from "../services/AuthService";

class AuthController {
  constructor() {}

  async register(req, res) {
    // Validation Test
    const { ...userData } = req.body;
    validation_result = RegisterInputValidation(userData);
    if (validataion_result["success"] === false)
      return res.status(400).json(validation_result);

    const result = AuthService.registerUser(req, res);
    if (result["success"] === false) return res.status(400).json(result);
    return res.status(200).json(result);
  }

  async login(req, res) {
    const { ...userData } = req.body;
    validation_result = LoginInputValidation(userData);
    if (validataion_result["success"] === false)
      return res.status(400).json(validation_result);

    const result = AuthService.loginUser(req, res);
    if (result["success"] === false) return res.status(400).json(result);
    return res.status(200).json(result);
  }
}

export default new AuthController();
