"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = "https://kuselopeqgsjoqdtkcyj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1c2Vsb3BlcWdzam9xZHRrY3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0MzgwMCwiZXhwIjoyMDU5NzE5ODAwfQ.MLhg0-8zW6qsg6KEPMDo6WmWGPIDS9bc4dzXqXH0XYc";
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
//# sourceMappingURL=supabaseClient.js.map