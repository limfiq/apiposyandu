import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://yiniahhbzqaxlqidmchb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbmlhaGhienFheGxxaWRtY2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3Mjg4MjgsImV4cCI6MjAyMDMwNDgyOH0.b35CW-exxS09DQyjEpoQvAZ5KB8xccsl9B095H81IHk'
);
