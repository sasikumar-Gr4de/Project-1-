import {createClient} from '@supabase/supabase-js'
import {RealtimeClient} from '@supabase/realtime-js'
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db:{
    schema: 'public'
  }
});

// Create public client for frontend operations
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  params:{
    apikey: supabaseAnonKey
  }
});

// Test Database connection
export const testSupabaseConnection = async () => {
    try{
        const {data, error} = await supabase.from('users').select('count').limit(1);
        if(error) throw error;
        console.log('Supabase connection successful');
        return true;
    }catch(err){
        console.error('Supabase connection error:', err.message);
        return false;
    }
};

