// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xlefjzjelzfvpryakyne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWZqemplbHpmdnByeWFreW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjIwNTIsImV4cCI6MjA2MzAzODA1Mn0.r3wnm8TuQpJH8fnVlbnQ-le2cFZwDx5MtbPt5JVTEHA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);