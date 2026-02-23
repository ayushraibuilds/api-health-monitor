/**
 * API Service Layer
 *
 * Provides a unified interface for fetching API usage data.
 * Currently uses mock data, designed to plug in real API integrations.
 *
 * To connect a real provider:
 * 1. Add API key to Settings → API Keys
 * 2. The service will auto-detect configured keys
 * 3. Real data blends with mock data for unconfigured providers
 */

import * as mockData from '../data/mockData';

const API_KEYS_STORAGE = 'pulseapi_api_keys';

/**
 * Get stored API keys
 */
export function getStoredKeys() {
    try {
        return JSON.parse(localStorage.getItem(API_KEYS_STORAGE) || '{}');
    } catch {
        return {};
    }
}

/**
 * Store an API key
 */
export function storeApiKey(provider, key) {
    const keys = getStoredKeys();
    keys[provider] = key;
    localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(keys));
}

/**
 * Remove an API key
 */
export function removeApiKey(provider) {
    const keys = getStoredKeys();
    delete keys[provider];
    localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(keys));
}

/**
 * Check if a provider has a real API key configured
 */
export function isProviderConnected(providerId) {
    const keys = getStoredKeys();
    return !!keys[providerId];
}

/**
 * Fetch OpenAI usage data (real API)
 * Requires: OpenAI API key with organization access
 */
async function fetchOpenAIUsage(apiKey) {
    try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);

        const response = await fetch(
            `https://api.openai.com/v1/organization/usage?start_date=${startDate.toISOString().split('T')[0]}&end_date=${today.toISOString().split('T')[0]}`,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.warn('OpenAI usage API returned:', response.status);
            return null;
        }

        return await response.json();
    } catch (err) {
        console.warn('Failed to fetch OpenAI usage:', err.message);
        return null;
    }
}

/**
 * Get all providers data (real + mock fallback)
 */
export async function getProvidersData() {
    const keys = getStoredKeys();
    let providers = [...mockData.providers];

    // If OpenAI key is configured, try to fetch real data
    if (keys.openai) {
        const realData = await fetchOpenAIUsage(keys.openai);
        if (realData) {
            // Merge real data into mock provider
            const idx = providers.findIndex(p => p.id === 'openai');
            if (idx >= 0) {
                providers[idx] = {
                    ...providers[idx],
                    // Map real data fields here when API response format is confirmed
                    _source: 'live',
                };
            }
        }
    }

    return providers;
}

/**
 * Get dashboard KPI data
 */
export function getKPIData() {
    return mockData.kpiMetrics;
}

/**
 * Get cost trend data
 */
export function getCostTrendData() {
    return mockData.costTrendData;
}

/**
 * Get spend breakdown data
 */
export function getSpendBreakdown() {
    return mockData.spendBreakdown;
}

/**
 * Get alerts
 */
export function getAlerts() {
    return mockData.alerts;
}

/**
 * Get all mock data exports (for components that need everything)
 */
export { mockData };
