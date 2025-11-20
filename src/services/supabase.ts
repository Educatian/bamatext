import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { StudentState, LogEntry } from '../data/types';

let supabase: SupabaseClient | null = null;

export const initSupabase = (url?: string, key?: string) => {
    const supabaseUrl = url || import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = key || import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return null;

    try {
        if (!supabase) {
            supabase = createClient(supabaseUrl, supabaseKey);
        }
        return supabase;
    } catch (e) {
        console.error("Failed to init Supabase:", e);
        return null;
    }
};

export const getSupabase = () => supabase;

// --- AUTH ---
export const signIn = async (email: string) => {
    if (!supabase) throw new Error("Supabase not initialized");
    // Using Magic Link for simplicity, or we can use password if enabled
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
};

// --- DATA SYNC ---

// Save the entire student state blob
export const saveStudentState = async (userId: string, state: StudentState) => {
    if (!supabase) return;

    // Upsert into profiles table
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            student_state: state,
            updated_at: new Date().toISOString()
        });

    if (error) console.error("Error saving state:", error);
};

// Load student state
export const loadStudentState = async (userId: string): Promise<StudentState | null> => {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('student_state')
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Error loading state:", error);
        return null;
    }
    return data?.student_state as StudentState;
};

// Log an event
export const logRemoteEvent = async (userId: string, entry: LogEntry) => {
    if (!supabase) return;

    const { error } = await supabase
        .from('logs')
        .insert({
            user_id: userId,
            event_type: entry.eventType,
            payload: entry.payload,
            created_at: new Date(entry.timestamp).toISOString()
        });

    if (error) console.error("Error logging event:", error);
};

// --- ADMIN ---

export const fetchAllProfiles = async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error("Error fetching profiles:", error);
        return [];
    }
    return data;
};

export const fetchRecentLogs = async (limit = 50) => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
    return data;
};

export const fetchDailyStats = async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(30); // Last 30 days

    if (error) {
        console.error("Error fetching daily stats:", error);
        return [];
    }
    return data;
};
