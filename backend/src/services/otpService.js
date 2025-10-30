import { supabase } from "../config/supabase.config.js";

export const generateAndStoreOTP = async (email = null, phone = null) => {
  // Validate input
  if (!email && !phone) {
    throw new Error("Email or phone is required");
  }

  // Generate cryptographically secure OTP
  const otp = generateSecureOtp();

  // Clean up any existing OTPs for this email/phone
  await cleanupExistingOtps(email, phone);

  // Store OTP with expiration
  const { data, error } = await supabase
    .from("auth_otp")
    .insert([
      {
        email,
        phone,
        otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        used: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("OTP storage error:", error);
    throw new Error("Failed to generate OTP");
  }

  return {
    otp,
    expiresAt: data.expires_at,
    id: data.id,
  };
};

export const verifyOTP = async (email = null, phone = null, otp) => {
  // Validate input
  if (!otp || otp.length !== 6) {
    return { isValid: false, error: "Invalid OTP format" };
  }

  if (!email && !phone) {
    return { isValid: false, error: "Email or phone is required" };
  }

  // Find valid OTP
  const { data, error } = await supabase
    .from("auth_otp")
    .select("*")
    .eq(email ? "email" : "phone", email || phone)
    .eq("otp", otp)
    .eq("used", false)
    .gt("expires_at", new Date())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { isValid: false, error: "Invalid or expired OTP" };
  }

  // Mark OTP as used
  await supabase
    .from("auth_otp")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    isValid: true,
    record: data,
    expiresAt: data.expires_at,
  };
};

export const cleanupExpiredOTPs = async () => {
  const { error } = await supabase
    .from("auth_otp")
    .delete()
    .lt("expires_at", new Date())
    .or("used.eq.true");

  if (error) {
    console.error("Failed to clean up expired OTPs:", error);
    throw error;
  }
};

// Helper functions
const generateSecureOtp = () => {
  // Use crypto.getRandomValues for better security
  const array = new Uint32Array(1);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    return ((array[0] % 900000) + 100000).toString();
  } else {
    // Fallback for environments without crypto
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

const cleanupExistingOtps = async (email, phone) => {
  const { error } = await supabase
    .from("auth_otp")
    .delete()
    .eq(email ? "email" : "phone", email || phone)
    .eq("used", false);

  if (error) {
    console.error("Cleanup existing OTPs error:", error);
  }
};
