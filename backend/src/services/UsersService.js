import User from "../models/User.js";
import Club from "../models/Club.js";
import Player from "../models/Player.js";
import { generateResponse } from "../utils/helpers.js";
import {
  USER_CREATE_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_DELETE_SUCCESS,
  USER_ACTIVATE_SUCCESS,
  USER_DEACTIVATE_SUCCESS,
  USER_NOT_FOUND,
  EMAIL_ALREADY_EXIST,
  INVALID_REFERENCE_ID,
  COMMON_GET_SUCCESS,
  USERS_FETCH_SUCCESS,
} from "../utils/messages.js";
import { CLIENT_TYPES, ROLE_TYPES } from "../utils/constants.js";
import { supabase } from "../config/supabase.config.js";

class UserService {
  static async createUser(userData) {
    try {
      const { email, client_type, role, reference_id } = userData;

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return generateResponse(null, EMAIL_ALREADY_EXIST);
      }

      // Validate reference_id for external clients
      if (client_type === CLIENT_TYPES.EXTERNAL && reference_id) {
        const isValidReference = await this.validateReferenceId(
          role,
          reference_id
        );
        if (!isValidReference) {
          return generateResponse(null, INVALID_REFERENCE_ID);
        }
      }

      // Create user in authentication system
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            client_type: userData.client_type,
            phone_number: userData.phone_number,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // Create user in database
      const dbUserData = {
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        client_type: userData.client_type,
        role: userData.role,
        phone_number: userData.phone_number,
        reference_id: userData.reference_id,
        avatar_url: userData.avatar_url,
        email_verified: false,
        is_active:
          userData.client_type === CLIENT_TYPES.INTERNAL ? false : true,
      };

      const user = await User.create(dbUserData);
      return generateResponse(user, USER_CREATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const result = await User.findAll(filters, pagination);

      return generateResponse(result, USERS_FETCH_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }
      return generateResponse(user, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(id, updateData) {
    try {
      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return generateResponse(null, USER_NOT_FOUND);
      }

      // If email is being updated, check for duplicates
      if (updateData.email && updateData.email !== existingUser.email) {
        const userWithEmail = await User.findByEmail(updateData.email);
        if (userWithEmail && userWithEmail.id !== id) {
          return generateResponse(null, EMAIL_ALREADY_EXIST);
        }
      }

      // Validate reference_id if provided
      if (updateData.reference_id) {
        const isValidReference = await this.validateReferenceId(
          updateData.role || existingUser.role,
          updateData.reference_id
        );
        if (!isValidReference) {
          return generateResponse(null, INVALID_REFERENCE_ID);
        }
      }

      const updatedUser = await User.update(id, updateData);
      return generateResponse(updatedUser, USER_UPDATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }

      // Soft delete - deactivate user
      const deactivatedUser = await User.deactivateUser(id);

      // Optionally: Also delete from auth system
      // const { error } = await supabase.auth.admin.deleteUser(id);

      return generateResponse(deactivatedUser, USER_DELETE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async activateUser(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }

      const activatedUser = await User.activateUser(id);
      return generateResponse(activatedUser, USER_ACTIVATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async deactivateUser(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }

      const deactivatedUser = await User.deactivateUser(id);
      return generateResponse(deactivatedUser, USER_DEACTIVATE_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getUsersByRole(role, pagination = { page: 1, limit: 10 }) {
    try {
      const filters = { role };
      const { data, total, page, limit } = await User.findAll(
        filters,
        pagination
      );

      const response = {
        users: data,
        role,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };

      return generateResponse(response, USERS_FETCH_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async getUserReferenceData(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return generateResponse(null, USER_NOT_FOUND);
      }

      const referenceData = await User.getReferenceDataById(id);
      return generateResponse(referenceData, COMMON_GET_SUCCESS);
    } catch (err) {
      throw err;
    }
  }

  static async validateReferenceId(role, reference_id) {
    try {
      if (!reference_id) return false;

      switch (role) {
        case ROLE_TYPES.USER_COACH:
          const club = await Club.findById(reference_id);
          return !!club;

        case ROLE_TYPES.USER_PLAYER:
        case ROLE_TYPES.USER_PARENT:
          const player = await Player.findById(reference_id);
          return !!player;

        default:
          return false;
      }
    } catch (err) {
      return false;
    }
  }
}

export default UserService;
