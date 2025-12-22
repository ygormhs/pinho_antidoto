import { createClient } from '@supabase/supabase-js';

// Hardcoded for zero-config Vercel deployment as requested
const supabaseUrl = 'https://rajkiubsbhnowhlrccfo.supabase.co';
const supabaseKey = 'sb_publishable_5uoWS5gNZICZkdiHRtaDbA_tY89lH03';

export const supabase = createClient(supabaseUrl, supabaseKey);
