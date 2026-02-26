import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Get the provider key (In production, decode pgsodium or use Vault)
    // For this implementation, we simulate fetching the stored API key
    const { data: providerData, error: providerError } = await supabaseClient
      .from('providers')
      .select('api_key_encrypted') // Assuming we store it plainly for this demo or decrypt it
      .eq('user_id', user.id)
      .eq('provider_name', 'openai')
      .single()

    if (providerError || !providerData) {
      throw new Error('OpenAI provider not configured')
    }

    // In a real scenario, you decrypt the key here. For our MVP, we assume it's accessible.
    // For demo purposes, we will return a simulated realistic OpenAI cost response
    // if a real key isn't actually configured in the vault.

    // Simulate real OpenAI fetch if a real key was decrypted:
    /*
    const response = await fetch('https://api.openai.com/v1/organization/usage...', {
        headers: { 'Authorization': `Bearer ${decryptedKey}` }
    })
    const usageData = await response.json()
    */

    // Simulated response matching the expected schema
    const today = new Date();
    const data = {
      total_spend: 14.23,
      requests: 12540,
      latency: 245,
      status: 'operational',
      // Example mock time-series
      trend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(today.getTime() - (29 - i) * 86400000).toISOString().split('T')[0],
        cost: Math.random() * 2 + 0.1
      }))
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
