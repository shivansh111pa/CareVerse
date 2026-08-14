import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing env vars");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  let rpcData = null;
  try {
    const res = await supabase.rpc('get_my_role').select('*').single();
    rpcData = res.data;
  } catch (e) {
    console.log("RPC Error");
  }
  console.log("RPC get_my_role:", rpcData);

  const { data: policies, error: polErr } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'profiles');
  
  if (polErr) {
    console.log("Could not read pg_policies (likely not exposed over API)");
  } else {
    console.log("POLICIES:", policies);
  }
}

main().catch(console.error);
