import { supabase } from "../config/supabase.config.js";

export const generateAndStoreOTP = async (email = null, phone = null) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

  // Store OTP in Supabase with a 5-minute expiration
  const { data, error } = await supabase
    .from("auth_otp")
    .insert([
      {
        email,
        phone,
        otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        used: false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error("Failed to store OTP");
  }

  return { opt, expiresAt, record: data };
};

export const verifyOTP = async (email = null, phone = null, otp) => {
  const { data, error } = await supabase
    .from("auth_otp")
    .select("*")
    .eq(email ? "email" : "phone", email || phone)
    .eq("otp", otp)
    .eq("used", false)
    .lte("expires_at", new Date())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { isValid: false, error: "Invalid or expired OTP" };
  }

  await supabase.from("auth_otp").update({ used: true }).eq("id", data.id);

  return { isValid: true, record: data };
};

export const cleanupExpiredOTPs = async () => {
  const { error } = await supabase
    .from("auth_otp")
    .delete()
    .lt("expires_at", new Date())
    .or("used.eq.true");

  if (error) {
    console.error("Failed to clean up expired OTPs:", error);
  }
};
