import sgMail from "../config/sendgrid.config.js";
import { generateAndStoreOTP, verifyOTP } from "../services/otpService.js";
import {
  getOrCreateUser,
  getUserProfile,
  updateUserProfile,
} from "../services/authService.js";
import { RESPONSES, AUTH_MESSAGES } from "../utils/messages.js";
import { OTP_CONFIG } from "../utils/constants.js";
import { supabase } from "../config/supabase.config.js";
import { generateCustomToken } from "../services/tokenService.js";

export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validate input
    if (!email && !phone) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST("Email or phone is required"));
    }

    if (email && phone) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST("Provide either email or phone, not both"));
    }

    // Generate and store OTP
    const { otp } = await generateAndStoreOTP(email, phone);

    // Send OTP via appropriate channel
    try {
      if (email) {
        await sendEmailOtp(email, otp);
      } else if (phone) {
        await sendWhatsAppOtp(phone, otp);
      }
    } catch (channelError) {
      console.error("OTP delivery failed:", channelError);
      // Continue - OTP is still stored and can be verified
    }

    res.json(
      RESPONSES.SUCCESS(AUTH_MESSAGES.OTP_SENT, {
        channel: email ? "email" : "whatsapp",
        expires_in: `${OTP_CONFIG.EXPIRY_MINUTES} minutes`,
        // Development only - never expose OTP in production
        ...(process.env.NODE_ENV === "development" && { otp }),
      })
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, phone, otp, ...userData } = req.body;

    if (!otp) {
      return res.status(400).json(RESPONSES.BAD_REQUEST("OTP is required"));
    }

    if (!email && !phone) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST("Email or phone is required"));
    }

    // Verify OTP
    const { isValid, error: otpError } = await verifyOTP(email, phone, otp);

    if (!isValid) {
      return res.status(400).json(RESPONSES.BAD_REQUEST(otpError));
    }

    // Get or create user
    const { user, isNewUser } = await getOrCreateUser(email, phone, userData);

    if (!user) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST(AUTH_MESSAGES.USER_NOT_FOUND));
    }

    // Get complete user profile
    let profile;
    try {
      profile = await getUserProfile(user.id);
    } catch (error) {
      // If profile doesn't exist yet, create it
      if (error.message.includes("not found")) {
        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            phone: phone || null,
            role: "player",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...userData,
          },
        ]);

        profile = await getUserProfile(user.id);
      } else {
        throw error;
      }
    }

    // Generate custom JWT token instead of Supabase session
    const token = generateCustomToken(profile);

    res.json(
      RESPONSES.SUCCESS(AUTH_MESSAGES.LOGIN_SUCCESS, {
        user: profile,
        token: token,
        token_type: "Bearer",
        expires_in: "7d",
        requires_onboarding: !profile.player_name,
        is_new_user: isNewUser,
      })
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    if (error.message.includes("User already registered")) {
      return res
        .status(409)
        .json(RESPONSES.CONFLICT(AUTH_MESSAGES.USER_EXISTS));
    }

    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    const profile = await getUserProfile(req.user.id);

    res.json(RESPONSES.SUCCESS(AUTH_MESSAGES.PROFILE_FETCHED, profile));
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Update user profile
 */
export const updateCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    const updates = req.body;

    // Remove protected fields
    const { id, email, created_at, ...allowedUpdates } = updates;

    const updatedProfile = await updateUserProfile(req.user.id, allowedUpdates);

    res.json(RESPONSES.SUCCESS(AUTH_MESSAGES.PROFILE_UPDATED, updatedProfile));
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Logout user (invalidate session)
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      // Invalidate the token with Supabase
      const { error } = await supabase.auth.admin.signOut(token);
      if (error) {
        console.error("Token invalidation error:", error);
      }
    }

    res.json(RESPONSES.SUCCESS(AUTH_MESSAGES.LOGOUT_SUCCESS));
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST("Refresh token is required"));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refresh_token);

    // Get user profile
    const profile = await getUserProfile(decoded.userId);

    // Generate new access token
    const newAccessToken = generateCustomToken(profile);

    res.json(
      RESPONSES.SUCCESS("Token refreshed", {
        access_token: newAccessToken,
        token_type: "Bearer",
        expires_in: "7d",
        user: profile,
      })
    );
  } catch (error) {
    console.error("Refresh token error:", error);

    if (
      error.message.includes("Invalid refresh token") ||
      error.name === "JsonWebTokenError"
    ) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED("Invalid refresh token"));
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED("Refresh token expired"));
    }

    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};
// Helper functions
const sendEmailOtp = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@gr4de.com",
    subject: "Your GR4DE Verification Code",
    text: `Your verification code is: ${otp}. This code expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">GR4DE Platform</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; color: #2563eb; letter-spacing: 8px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  // await sgMail.send(msg);
  console.log("OTP sent via email to:", email);
};

const sendWhatsAppOtp = async (phone, otp) => {
  console.log("OTP for WhatsApp:", otp, "to:", phone);
  // Implement Twilio WhatsApp integration here
  // await twilioClient.messages.create({
  //   body: `Your GR4DE verification code is: ${otp}. This code expires in 5 minutes.`,
  //   from: process.env.TWILIO_WHATSAPP_FROM,
  //   to: `whatsapp:${phone}`,
  // });
};
