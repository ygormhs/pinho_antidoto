import { createClient } from '@supabase/supabase-js';

// Usando as credenciais diretamente para facilitar o deploy no Vercel
const supabaseUrl = 'https://rajkiubsbhnowhlrccfo.supabase.co';
const supabaseKey = 'sb_publishable_5uoWS5gNZICZkdiHRtaDbA_tY89lH03';

export const supabase = createClient(supabaseUrl, supabaseKey);
