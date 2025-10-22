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
  EMAIL_VERIFY_REQUIRED,
  USER_NOT_FOUND,
  COMMON_GET_SUCCESS,
  COMMON_UPDATE_SUCCESS,
  LOGOUT_SUCCESS,
  CURRENT_PASSWORD_INCORRECT,
  PASSWORD_UPDATE_SUCCESS,
  VERIFY_EMAIL_RESENT,
  VERIFY_STATUS_ERROR,
} from "../utils/messages";
import { CLIENT_TYPES, ROLE_TYPES } from "../utils/constants";
import { supabase } from "../config/supabase.config";
import { sign } from "crypto";

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
      throw err;
    }
  }

  static async getProfile(req, res) {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);

      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }
      return generateResponse(user, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateProfile(req, res) {
    try {
      const { userId } = req.user;
      const { ...updatedData } = req.body;
      const user = await User.update(userId, updatedData);

      return generateResponse(user, COMMON_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      const { userId } = req.user.userId;

      const user = User.findById(userId);
      if (!user) return generateResponse(null, USER_NOT_FOUND);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current_password,
      });

      if (signInError) {
        return generateResponse(null, CURRENT_PASSWORD_INCORRECT);
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: new_password,
      });

      if (updateError) {
        throw updateError;
      }

      return generateResponse(user, PASSWORD_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async sendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      const { error } = await supabase.auth.resned({
        type: "signup",
        email: email,
      });
      if (error) {
        throw error;
      }
      const data = { email };
      return generateResponse(data, VERIFY_EMAIL_RESENT);
    } catch (err) {
      throw err;
    }
  }

  static async checkVerificationStatus(req, res) {
    try {
      const { userId } = req.user;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.admin.getUserById(userId);
      if (userError) {
        return generateResponse(null, VERIFY_STATUS_ERROR);
      }
    } catch (err) {
      throw err;
    }
  }

  static async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Logout error:", error);
      }
      return {
        success: true,
        message: LOGOUT_SUCCESS,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
