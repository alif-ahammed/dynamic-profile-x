import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jpqepggzeiumoytliszy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcWVwZ2d6ZWl1bW95dGxpc3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODgwODcsImV4cCI6MjA5MDE2NDA4N30.IGUj2TmDti5Hfpi1SAnRRXTUOGwm5mw6fyyratrqu-g";

export const supabase = createClient(supabaseUrl, supabaseKey);
