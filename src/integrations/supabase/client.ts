// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bkhchimibpewjdbdpdxq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraGNoaW1pYnBld2pkYmRwZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTUxMjksImV4cCI6MjA1ODE3MTEyOX0.HF892iX3RQjV7zXnyjP6wW1avxD_p6UCASaVzSS_j2k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);