import { createClient } from "@supabase/supabase-js";
import { RealtimeClient } from "@supabase/realtime-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: "public",
  },
});

// Create public client for frontend operations
export const supabasePublic = createClient(supabaseUrl, supabaseServiceKey, {
  params: {
    apikey: supabaseServiceKey,
  },
});

// Test Database connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) throw error;
    console.log("Supabase connection successful");
    return true;
  } catch (err) {
    console.error("Supabase connection error:", err.message);
    return false;
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.from("users").select("*").limit(1);
    const responseTime = Date.now() - startTime;

    return {
      status: error ? "unhealthy" : "healthy",
      responseTime: `${responseTime}ms`,
      error: error ? error.message : null,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: null,
      error: error.message,
    };
  }
};
