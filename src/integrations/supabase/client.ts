// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mfjxoreeycicnlezxaew.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1manhvcmVleWNpY25sZXp4YWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MDU4OTEsImV4cCI6MjA1OTE4MTg5MX0.SAjeuraLuoLOYEQumlPCdSRnR0mv6POlt54UgPlBUZk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);