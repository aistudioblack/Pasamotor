import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('products')
    .update({ title: 'VARTA 514 902 021 AGM YTX16BS 12V 14Ah Akü Orijinal – AVM26682292VNH000' })
    .eq('sku', 'AVM26682292VNH000')
    .select();

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Successfully updated:', data);
  }
}

main();
