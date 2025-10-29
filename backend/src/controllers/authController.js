import sgMail from "../config/sendgrid.config.js";
import twilioClient from "../config/twilio.config.js";
import { generateAndStoreOTP, verifyOTP } from "../services/otpService.js";
import { createUser, getUserProfile } from "../services/authService.js";
import { RESPONSES, AUTH_MESSAGES } from "../utils/messages.js";

/**
 * Send OTP to email or WhatsApp
 */
export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Generate and store OTP
    const { otp, expiresAt } = await generateAndStoreOTP(email, phone);

    // Send OTP via appropriate channel
    if (email) {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@gr4de.com",
        subject: "Your GR4DE Verification Code",
        text: `Your verification code is: ${otp}. This code expires in 10 minutes.`,
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

      await sgMail.send(msg);
    } else if (phone) {
      await twilioClient.messages.create({
        body: `Your GR4DE verification code is: ${otp}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${phone}`,
      });
    }

    res.json(
      RESPONSES.SUCCESS(AUTH_MESSAGES.OTP_SENT, {
        channel: email ? "email" : "whatsapp",
        expires_in: "10 minutes",
      })
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Verify OTP and authenticate user
 */
export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, phone, otp, ...userData } = req.body;

    // Verify OTP
    const { isValid, error: otpError } = await verifyOTP(email, phone, otp);

    if (!isValid) {
      return res.status(400).json(RESPONSES.BAD_REQUEST(otpError));
    }

    // Create or get user
    let user;
    try {
      const result = await createUser(email, phone, userData);
      user = result.user;
    } catch (error) {
      if (error.message === "User already registered") {
        // Get existing user
        const { data: authData } = email
          ? await supabase.auth.admin.getUserByEmail(email)
          : { data: null }; // Would need phone lookup logic

        if (authData) {
          user = authData.user;
        }
      } else {
        throw error;
      }
    }

    if (!user) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST(AUTH_MESSAGES.USER_NOT_FOUND));
    }

    // Generate session token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.admin.createSession({
      userId: user.id,
      // ... other session properties
    });

    if (sessionError) throw sessionError;

    // Get user profile
    const profile = await getUserProfile(user.id);

    res.json(
      RESPONSES.SUCCESS(AUTH_MESSAGES.LOGIN_SUCCESS, {
        user: profile,
        session: session,
      })
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.id);
    res.json(RESPONSES.SUCCESS(AUTH_MESSAGES.PROFILE_FETCHED, profile));
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    // Client should remove the token
    res.json(RESPONSES.SUCCESS(AUTH_MESSAGES.LOGOUT_SUCCESS));
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};
