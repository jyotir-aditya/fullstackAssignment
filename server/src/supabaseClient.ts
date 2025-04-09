import { createClient } from "@supabase/supabase-js";

// Use environment variables if available, otherwise fallback to hardcoded values
const supabaseUrl =
  process.env.SUPABASE_URL || "https://kuselopeqgsjoqdtkcyj.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc";

// Add validation to prevent Invalid URL errors
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or key is missing. Please check your environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
