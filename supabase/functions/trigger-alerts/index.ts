import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resendApiKey = Deno.env.get('RESEND_API_KEY');

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

        const requestData = await req.json()
        const { alertTitle, providerName, severity, cost } = requestData

        if (!resendApiKey) {
            throw new Error('Resend API key not configured in Edge Function envs')
        }

        // Send the email using Resend HTTP API
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: 'PulseAPI Alerts <alerts@resend.dev>', // Default testing domain
                to: [user.email],
                subject: `[${severity.toUpperCase()}] PulseAPI Alert: ${alertTitle}`,
                html: `
                <h2>PulseAPI Health & Cost Alert</h2>
                <p>Hello,</p>
                <p>This is an automated alert regarding your configured provider <strong>${providerName}</strong>.</p>
                <p><strong>Alert Title:</strong> ${alertTitle}</p>
                <p><strong>Severity:</strong> ${severity}</p>
                <p><strong>Current Info/Cost:</strong> $${cost}</p>
                <p><br/>Log into your PulseAPI dashboard to view full analytics.</p>
                <p>--<br/>PulseAPI Team</p>
            `
            })
        })

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to send email: ${errorText}`);
        }

        const resendData = await res.json()

        // Store the triggered alert record in the database
        // Assume `alerts_log` table exists or will be created
        await supabaseClient.from('alerts_log').insert({
            user_id: user.id,
            provider_name: providerName,
            title: alertTitle,
            severity,
            resend_id: resendData.id,
            acknowledged: false
        });

        return new Response(
            JSON.stringify({ success: true, id: resendData.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
