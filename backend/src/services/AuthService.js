import User from "../models/User";
import Club from "../models/Club";
import Player from "../models/Player";
import { generateResponse, generateToken } from "../utils/helpers";
import {
  EMAIL_ALREADY_EXIST,
  INVALID_REFERENCE_ID,
  SUPABASE_EMAIL_NOT_CONFIRMED,
  EMAIL_NOT_CONFIRMED,
  SUPABASE_INVALID_CREDENTIALS,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS_EXTERNAL,
  REGISTER_SUCCESS_INTERNAL,
  EMAIL_VERIFY_REQUIRED,
} from "../utils/messages";
import { CLIENT_TYPES, ROLE_TYPES } from "../utils/constants";
import { supabase } from "../config/supabase.config";

export class AuthService {
  static async registerUser(req, res) {
    try {
      const { ...userData } = req.body;
      const { email, client_type, role } = userData;
      const existing_user = User.findByEmail(email);
      if (existing_user) return generateResponse(null, EMAIL_ALREADY_EXIST);

      if (client_type === CLIENT_TYPES.INTERNAL) userData["is_active"] = false;
      else if (client_type === CLIENT_TYPES.EXTERNAL) {
        let check = false;
        if (role === ROLE_TYPES.USER_COACH && Club.findById(reference_id))
          check = true;
        if (
          (role === ROLE_TYPES.USER_PARENT ||
            role === ROLE_TYPES.USER_PLAYER) &&
          Player.findById(reference_id)
        )
          check = true;
        if (check === false) {
          // invalid reference_id
          return generateResponse(null, INVALID_REFERENCE_ID);
        }
      }

      const data = User.create(userData);

      // Generate Token
      const { id: user_id } = data;
      const token = generateToken(user_id);
      User.updateLastLogin(user_id);
      data["token"] = token;

      return generateResponse(data, EMAIL_VERIFY_REQUIRED);
    } catch (err) {
      console.log("Error in AuthService:regiseruser:", err.message);
      throw err;
    }
  }

  static async loginUser(req, res) {
    try {
      const { ...userData } = req.body;
      const { email, password } = userData;

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        if (authError.message === SUPABASE_EMAIL_NOT_CONFIRMED)
          return generateResponse(null, EMAIL_NOT_CONFIRMED);
        else if (authError.message === SUPABASE_INVALID_CREDENTIALS)
          return generateResponse(null, INVALID_CREDENTIALS);
      }

      // Generate Token
      const { id: user_id } = data;
      const token = generateToken(user_id);
      User.updateLastLogin(user_id);
      data["token"] = token;

      return generateResponse(data, LOGIN_SUCCESS);
    } catch (err) {
      console.log("Error in AuthService:loginUser:", err.message);
      throw err;
    }
  }
}

export default new AuthService();
