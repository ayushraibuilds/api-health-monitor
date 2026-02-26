import { supabase } from '../lib/supabase';

/**
 * API Service Layer for Supabase Backend
 */

async function getUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id;
}

export async function getProvidersData() {
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching providers:', error);
        return [];
    }

    // Map DB schema to frontend expected format
    const providersList = await Promise.all(data.map(async (provider) => {
        let baseData = {
            id: provider.id,
            name: provider.provider_name.charAt(0).toUpperCase() + provider.provider_name.slice(1),
            status: 'operational',
            latency: 0,
            requests: 0,
            spend: 0,
            color: provider.provider_name === 'openai' ? '#10a37f' : '#6366f1'
        };

        if (provider.provider_name === 'openai') {
            try {
                const { data: edgeData, error: edgeError } = await supabase.functions.invoke('fetch-openai-usage', {});
                if (!edgeError && edgeData) {
                    baseData.spend = edgeData.total_spend || 0;
                    baseData.requests = edgeData.requests || 0;
                    baseData.latency = edgeData.latency || 0;
                    baseData.status = edgeData.status || 'operational';
                }
            } catch (err) {
                console.warn('Failed to fetch OpenAI live data from edge function', err);
            }
        }
        return baseData;
    }));

    return providersList;
}

export async function getKPIData() {
    const userId = await getUserId();
    if (!userId) return null;

    return {
        totalSpend: { label: 'Total Spend (30d)', value: '$0.00', trend: '0%', trendDirection: 'down' },
        monthlyEstimate: { label: 'Monthly Estimate', value: '$0.00', trend: '0%', trendDirection: 'down' },
        avgLatencyMs: { label: 'Avg Latency', value: '0ms', trend: '0ms', trendDirection: 'down' },
        activeProviders: { label: 'Active Providers', value: '0', trend: '0', trendDirection: 'up' },
    };
}

export async function getCostTrendData() {
    return [];
}

export async function getSpendBreakdown() {
    return [];
}

export async function getAlerts() {
    return [];
}

export async function storeApiKey(provider, key) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (user.email === 'demo@pulseapi.com') {
        alert('Saving API keys is disabled in Demo Mode for security.');
        return;
    }

    const userId = user.id;
    // Using a placeholder nonce and empty encrypted key if pgsodium isn't fully set up yet
    const { error } = await supabase
        .from('providers')
        .upsert({
            user_id: userId,
            provider_name: provider,
            // In a real env, edge functions handle this encryption. Sending raw key for demo logic:
            api_key_encrypted: '\\x00',
            api_key_nonce: '\\x00'
        }, { onConflict: 'user_id,provider_name' });

    if (error) {
        console.error('Error storing API key:', error);
    }
}

export async function removeApiKey(provider) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (user.email === 'demo@pulseapi.com') {
        alert('Removing API keys is disabled in Demo Mode for security.');
        return;
    }

    const userId = user.id;

    const { error } = await supabase
        .from('providers')
        .delete()
        .match({ user_id: userId, provider_name: provider });

    if (error) {
        console.error('Error removing API key:', error);
    }
}

export async function isProviderConnected(provider) {
    const userId = await getUserId();
    if (!userId) return false;

    const { data, error } = await supabase
        .from('providers')
        .select('id')
        .match({ user_id: userId, provider_name: provider })
        .single();

    if (error) return false;
    return !!data;
}

export async function triggerAlert(alertTitle, providerName, severity, cost) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (user.email === 'demo@pulseapi.com') {
        alert('Email dispatch is disabled in Demo Mode to prevent abuse.');
        return { success: false, error: 'Demo mode active' };
    }

    const userId = user.id;

    const { data, error } = await supabase.functions.invoke('trigger-alerts', {
        body: { alertTitle, providerName, severity, cost }
    });

    if (error) {
        console.error('Error triggering alert:', error);
        return { success: false, error };
    }
    return { success: true, data };
}
