import { supabase } from '../lib/supabase';

/**
 * API Service Layer for Supabase Backend
 */

async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
}

// --- MOCK DATA FOR DEMO MODE ---
const demoProviders = [
    { id: '1', name: 'OpenAI', status: 'operational', latency: 245, requests: 12540, spend: 14.23, color: '#10a37f' },
    { id: '2', name: 'Anthropic', status: 'degraded', latency: 850, requests: 3420, spend: 8.50, color: '#d97757' },
    { id: '3', name: 'Google AI', status: 'operational', latency: 120, requests: 8900, spend: 5.12, color: '#4285f4' },
];

const demoKPIs = {
    totalSpend: { label: 'Total Spend (30d)', value: '$224.50', trend: '+12.5%', trendDirection: 'up' },
    monthlyEstimate: { label: 'Monthly Estimate', value: '$450.00', trend: '-5.2%', trendDirection: 'down' },
    avgLatencyMs: { label: 'Avg Latency', value: '185ms', trend: '-12ms', trendDirection: 'down' },
    activeProviders: { label: 'Active Providers', value: '3', trend: '+1', trendDirection: 'up' },
};

const demoTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    OpenAI: Math.random() * 10 + 2,
    Anthropic: Math.random() * 5 + 1,
    'Google AI': Math.random() * 3 + 0.5
}));

const demoBreakdown = [
    { name: 'OpenAI', value: 340, color: '#10a37f' },
    { name: 'Anthropic', value: 120, color: '#d97757' },
    { name: 'Google AI', value: 85, color: '#4285f4' },
];

const demoAlerts = [
    { id: 'a1', title: 'High Latency Detected', provider_name: 'Anthropic', severity: 'warning', created_at: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
    { id: 'a2', title: 'Cost Threshold Exceeded', provider_name: 'OpenAI', severity: 'critical', created_at: new Date(Date.now() - 86400000).toISOString(), acknowledged: false },
];
// ------------------------------

export async function getProvidersData() {
    const user = await getUser();
    if (!user) return [];
    if (user.email === 'demo@pulseapi.com') return demoProviders;

    const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user.id);

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
    const user = await getUser();
    if (!user) return null;
    if (user.email === 'demo@pulseapi.com') return demoKPIs;

    return {
        totalSpend: { label: 'Total Spend (30d)', value: '$0.00', trend: '0%', trendDirection: 'down' },
        monthlyEstimate: { label: 'Monthly Estimate', value: '$0.00', trend: '0%', trendDirection: 'down' },
        avgLatencyMs: { label: 'Avg Latency', value: '0ms', trend: '0ms', trendDirection: 'down' },
        activeProviders: { label: 'Active Providers', value: '0', trend: '0', trendDirection: 'up' },
    };
}

export async function getCostTrendData() {
    const user = await getUser();
    if (user?.email === 'demo@pulseapi.com') return demoTrend;
    return [];
}

export async function getSpendBreakdown() {
    const user = await getUser();
    if (user?.email === 'demo@pulseapi.com') return demoBreakdown;
    return [];
}

export async function getAlerts() {
    const user = await getUser();
    if (user?.email === 'demo@pulseapi.com') return demoAlerts;
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
    const user = await getUser();
    if (!user) return false;

    if (user.email === 'demo@pulseapi.com') {
        const demoProvidersConnected = ['openai', 'anthropic', 'google ai'];
        return demoProvidersConnected.includes(provider.toLowerCase());
    }

    const { data, error } = await supabase
        .from('providers')
        .select('id')
        .match({ user_id: user.id, provider_name: provider })
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
