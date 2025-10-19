import { createClient } from "@supabase/supabase-js";
import { RealtimeClient } from "@supabase/realtime-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // no persistent session in serverless
    detectSessionInUrl: false,
  },
  db: {
    schema: "public",
  },
});

// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
//   params: {
//     apikey: supabaseAnonKey,
//   },
// });

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
