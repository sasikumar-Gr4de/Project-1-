import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helper functions
export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },
};

// Storage helper functions
export const storage = {
  uploadFile: async (file, path, bucket = "gr4de-platform") => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    return { data, error };
  },

  getPublicUrl: (path, bucket = "gr4de-platform") => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  },

  deleteFile: async (path, bucket = "gr4de-platform") => {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);

    return { data, error };
  },

  listFiles: async (path = "", bucket = "gr4de-platform") => {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    return { data, error };
  },
};

// Real-time subscriptions
export const realtime = {
  subscribeToPlayers: (callback) => {
    return supabase
      .channel("players-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
        },
        callback
      )
      .subscribe();
  },

  subscribeToMatches: (callback) => {
    return supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        callback
      )
      .subscribe();
  },

  subscribeToMatchEvents: (matchId, callback) => {
    return supabase
      .channel(`match-${matchId}-events`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${matchId}`,
        },
        callback
      )
      .subscribe();
  },

  unsubscribe: (channel) => {
    return supabase.removeChannel(channel);
  },
};

// Database helper functions
export const database = {
  from: (table) => supabase.from(table),

  // Common queries
  getFootballPositions: async () => {
    const { data, error } = await supabase
      .from("football_positions")
      .select("*")
      .order("position_category")
      .order("typical_x");
    return { data, error };
  },

  getClubs: async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("id, name, logo_url, country")
      .order("name");
    return { data, error };
  },

  getTournaments: async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, name, season, country")
      .order("start_date", { ascending: false });
    return { data, error };
  },
};

export default supabase;
