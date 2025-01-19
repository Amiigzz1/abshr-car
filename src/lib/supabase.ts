import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iauzmetvyhkvuuleeemo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdXptZXR2eWhrdnV1bGVlZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjkyMDIsImV4cCI6MjA1MjcwNTIwMn0.APD-olMWD3fxOY292kE6_Defa9gatnALJwV1V7zvcZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);