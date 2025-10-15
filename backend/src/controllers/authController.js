import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { User } from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      role = "client",
      client_type,
      organization,
      phone_number,
    } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and full name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Validate role
    const allowedRoles = [
      "admin",
      "data-reviewer",
      "annotator",
      "client",
      "coach",
      "scout",
    ];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      full_name,
      role,
      client_type: role === "client" ? client_type : null,
      organization,
      phone_number,
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login
    await User.updateLastLogin(user.id);
    console.log("updateLastLogin");
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          client_type: user.client_type,
          organization: user.organization,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific Supabase errors
    if (error.message.includes("already registered")) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error registering user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      if (authError.message === "Invalid login credentials") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (authError.message === "Email not confirmed") {
        return res.status(401).json({
          success: false,
          message: "Please verify your email address before logging in",
        });
      }

      throw authError;
    }

    // Get user profile from our database
    const user = await User.findById(authData.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User profile not found",
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Update last login
    await User.updateLastLogin(user.id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          client_type: user.client_type,
          organization: user.organization,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
          last_login: user.last_login,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          client_type: user.client_type,
          organization: user.organization,
          phone_number: user.phone_number,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
          email_verified: user.email_verified,
          last_login: user.last_login,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, organization, phone_number } = req.body;
    const updates = {};

    if (full_name) updates.full_name = full_name;
    if (organization !== undefined) updates.organization = organization;
    if (phone_number !== undefined) updates.phone_number = phone_number;

    const updatedUser = await User.update(req.user.userId, updates);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          full_name: updatedUser.full_name,
          role: updatedUser.role,
          client_type: updatedUser.client_type,
          organization: updatedUser.organization,
          phone_number: updatedUser.phone_number,
          avatar_url: updatedUser.avatar_url,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    });

    if (error) {
      // Don't reveal if email exists or not
      console.error("Password reset request error:", error);
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting password reset",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Add these functions to the existing authController.js
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.userId;

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current_password,
    });

    if (signInError) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    // Verify and update password using Supabase Auth
    const { data, error } = await supabase.auth.updateUser(
      {
        password: new_password,
      },
      {
        accessToken: token,
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.CLIENT_URL}/verify-success`,
      },
    });

    if (error) {
      console.error("Resend verification error:", error);
      // Don't reveal if email exists or not
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message:
        "If an account with that email exists, a verification email has been sent.",
    });
  } catch (error) {
    console.error("Send verification email error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending verification email",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current session to check email confirmation status
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const isVerified = session?.user?.email_confirmed_at !== null;

    // Sync with our database
    if (isVerified) {
      await supabase
        .from("users")
        .update({
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    res.json({
      success: true,
      data: {
        email_verified: isVerified,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Check verification status error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking verification status",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Verify email using Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "signup",
    });

    if (error) {
      console.error("Email verification error:", error);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Update user email verification status in our database
    await supabase
      .from("users")
      .update({
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);

    // Generate a new session/token after verification
    const new_token = generateToken(data.user.id);

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          email_verified: true,
        },
        token: new_token,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying email",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (signInError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      // If we can't delete from auth, at least deactivate the user
      await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", userId);

      return res.status(500).json({
        success: false,
        message:
          "Error deleting account from authentication service. Account has been deactivated instead.",
      });
    }

    // Delete user from our database
    await supabase.from("users").delete().eq("id", userId);

    // Clear any stored tokens
    res.clearCookie("token");

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
