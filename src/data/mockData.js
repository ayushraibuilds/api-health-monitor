// ===== PROVIDERS =====
export const providers = [
    {
        id: 'openai',
        name: 'OpenAI',
        type: 'LLM / GPT Models',
        color: '#10a37f',
        status: 'healthy',
        latency: 234,
        uptime: 99.97,
        spend: 1247.80,
        budget: 2000,
        requests: 45230,
        errorRate: 0.12,
        models: ['GPT-4o', 'GPT-4o-mini', 'o1-preview', 'DALL·E 3'],
        endpoints: [
            { name: '/v1/chat/completions', requests: 38200, latency: 280, cost: 980.50 },
            { name: '/v1/embeddings', requests: 5100, latency: 45, cost: 12.30 },
            { name: '/v1/images/generations', requests: 1930, latency: 2100, cost: 255.00 },
        ],
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        type: 'Claude Models',
        color: '#d4a27f',
        status: 'healthy',
        latency: 312,
        uptime: 99.94,
        spend: 892.40,
        budget: 1500,
        requests: 28450,
        errorRate: 0.08,
        models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
        endpoints: [
            { name: '/v1/messages', requests: 27800, latency: 320, cost: 870.40 },
            { name: '/v1/complete', requests: 650, latency: 180, cost: 22.00 },
        ],
    },
    {
        id: 'google',
        name: 'Google AI',
        type: 'Gemini Models',
        color: '#4285f4',
        status: 'warning',
        latency: 456,
        uptime: 99.82,
        spend: 534.20,
        budget: 800,
        requests: 18900,
        errorRate: 0.34,
        models: ['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'],
        endpoints: [
            { name: '/v1/models/generate', requests: 17200, latency: 480, cost: 498.20 },
            { name: '/v1/models/embed', requests: 1700, latency: 62, cost: 36.00 },
        ],
    },
    {
        id: 'aws',
        name: 'AWS Bedrock',
        type: 'Multi-Model Gateway',
        color: '#ff9900',
        status: 'healthy',
        latency: 189,
        uptime: 99.99,
        spend: 678.90,
        budget: 1000,
        requests: 32100,
        errorRate: 0.05,
        models: ['Claude (Bedrock)', 'Titan', 'Llama 3'],
        endpoints: [
            { name: 'InvokeModel', requests: 28400, latency: 195, cost: 612.90 },
            { name: 'InvokeModelStream', requests: 3700, latency: 340, cost: 66.00 },
        ],
    },
    {
        id: 'stripe',
        name: 'Stripe',
        type: 'Payment Processing',
        color: '#635bff',
        status: 'healthy',
        latency: 145,
        uptime: 99.99,
        spend: 89.50,
        budget: 200,
        requests: 8920,
        errorRate: 0.02,
        models: [],
        endpoints: [
            { name: '/v1/charges', requests: 4200, latency: 130, cost: 42.00 },
            { name: '/v1/customers', requests: 3100, latency: 95, cost: 31.00 },
            { name: '/v1/subscriptions', requests: 1620, latency: 110, cost: 16.50 },
        ],
    },
    {
        id: 'twilio',
        name: 'Twilio',
        type: 'Communications API',
        color: '#f22f46',
        status: 'critical',
        latency: 890,
        uptime: 98.45,
        spend: 223.60,
        budget: 300,
        requests: 12400,
        errorRate: 2.8,
        models: [],
        endpoints: [
            { name: '/Messages', requests: 9800, latency: 920, cost: 176.40 },
            { name: '/Calls', requests: 1200, latency: 780, cost: 36.00 },
            { name: '/Verify', requests: 1400, latency: 340, cost: 11.20 },
        ],
    },
];

// ===== COST TREND DATA (30 days) =====
export const costTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const base = 95 + Math.sin(i * 0.3) * 25;
    return {
        date: day,
        openai: +(base * (0.9 + Math.random() * 0.3)).toFixed(2),
        anthropic: +(base * (0.55 + Math.random() * 0.2)).toFixed(2),
        google: +(base * (0.3 + Math.random() * 0.15)).toFixed(2),
        aws: +(base * (0.4 + Math.random() * 0.2)).toFixed(2),
        total: 0,
    };
}).map(d => ({ ...d, total: +(d.openai + d.anthropic + d.google + d.aws).toFixed(2) }));

// ===== PROVIDER SPEND BREAKDOWN (Donut chart) =====
export const spendBreakdown = [
    { name: 'OpenAI', value: 1247.80, color: '#10a37f' },
    { name: 'Anthropic', value: 892.40, color: '#d4a27f' },
    { name: 'AWS Bedrock', value: 678.90, color: '#ff9900' },
    { name: 'Google AI', value: 534.20, color: '#4285f4' },
    { name: 'Twilio', value: 223.60, color: '#f22f46' },
    { name: 'Stripe', value: 89.50, color: '#635bff' },
];

// ===== KPI METRICS =====
export const kpiMetrics = {
    totalSpend: {
        value: '$3,666',
        subValue: 'of $5,800 budget',
        trend: '+12.3%',
        trendDirection: 'up',
        label: 'Monthly Spend (MTD)',
    },
    activeApis: {
        value: '6',
        subValue: '24 endpoints',
        trend: '+1',
        trendDirection: 'up',
        label: 'Active APIs',
    },
    avgLatency: {
        value: '287ms',
        subValue: 'p95: 680ms',
        trend: '-8.2%',
        trendDirection: 'up',
        label: 'Avg Latency',
    },
    uptime: {
        value: '99.86%',
        subValue: '1 incident today',
        trend: '-0.14%',
        trendDirection: 'down',
        label: 'Overall Uptime',
    },
};

// ===== ALERTS =====
export const alerts = [
    {
        id: 1,
        severity: 'critical',
        title: 'Twilio API Degraded Performance',
        description: 'Twilio Messages endpoint latency exceeded 800ms threshold. Error rate at 2.8%.',
        provider: 'Twilio',
        timestamp: '2 min ago',
        acknowledged: false,
    },
    {
        id: 2,
        severity: 'warning',
        title: 'Google AI Latency Spike',
        description: 'Gemini model generation latency increased by 34% compared to baseline.',
        provider: 'Google AI',
        timestamp: '18 min ago',
        acknowledged: false,
    },
    {
        id: 3,
        severity: 'warning',
        title: 'OpenAI Budget 62% Utilized',
        description: 'Monthly OpenAI spend has reached $1,247.80 of $2,000 budget (62%). At current rate, projected to hit 94% by month end.',
        provider: 'OpenAI',
        timestamp: '1 hour ago',
        acknowledged: true,
    },
    {
        id: 4,
        severity: 'info',
        title: 'AWS Bedrock — New Model Available',
        description: 'Claude 3.5 Sonnet v2 is now available on AWS Bedrock. Consider migrating for improved performance.',
        provider: 'AWS Bedrock',
        timestamp: '3 hours ago',
        acknowledged: true,
    },
    {
        id: 5,
        severity: 'critical',
        title: 'Twilio Service Outage – SMS Delivery',
        description: 'Complete SMS delivery failure detected. 342 messages queued. Twilio status page reports partial outage.',
        provider: 'Twilio',
        timestamp: '45 min ago',
        acknowledged: false,
    },
    {
        id: 6,
        severity: 'warning',
        title: 'Anthropic Rate Limit Approaching',
        description: 'Claude 3.5 Sonnet usage at 78% of rate limit. Consider implementing request queuing.',
        provider: 'Anthropic',
        timestamp: '2 hours ago',
        acknowledged: true,
    },
    {
        id: 7,
        severity: 'info',
        title: 'Weekly Cost Report Ready',
        description: 'Your weekly API cost summary is ready. Total spend: $892.40 (-3.2% vs previous week).',
        provider: 'System',
        timestamp: '6 hours ago',
        acknowledged: true,
    },
];

// ===== INCIDENT TIMELINE =====
export const incidents = [
    { time: '14:32', severity: 'critical', title: 'Twilio SMS Outage', desc: 'SMS delivery failures detected across all regions.' },
    { time: '14:18', severity: 'warning', title: 'Google AI Latency +34%', desc: 'Gemini API response times elevated.' },
    { time: '11:45', severity: 'healthy', title: 'OpenAI Restored', desc: 'GPT-4o completions endpoint fully recovered.' },
    { time: '10:30', severity: 'warning', title: 'OpenAI Degraded', desc: 'Intermittent 429 errors on chat completions.' },
    { time: '08:15', severity: 'info', title: 'Daily cost report', desc: 'Yesterday\'s total: $128.42 (within budget).' },
    { time: '06:00', severity: 'healthy', title: 'All systems operational', desc: 'Morning health check passed for all providers.' },
];

// ===== ALERT RULES =====
export const alertRules = [
    { id: 1, name: 'Budget Threshold', type: 'cost', condition: 'Spend > 80% of budget', providers: ['All'], enabled: true, channel: 'Email + Slack' },
    { id: 2, name: 'Latency Spike', type: 'performance', condition: 'p95 Latency > 500ms', providers: ['OpenAI', 'Anthropic'], enabled: true, channel: 'Slack' },
    { id: 3, name: 'Error Rate', type: 'reliability', condition: 'Error Rate > 1%', providers: ['All'], enabled: true, channel: 'Email + Slack + Webhook' },
    { id: 4, name: 'Downtime Detection', type: 'availability', condition: 'Uptime < 99.5%', providers: ['All'], enabled: true, channel: 'Email + Slack' },
    { id: 5, name: 'Rate Limit Warning', type: 'throttle', condition: 'Usage > 75% of limit', providers: ['OpenAI', 'Anthropic', 'Google AI'], enabled: false, channel: 'Slack' },
    { id: 6, name: 'Cost Anomaly', type: 'cost', condition: 'Daily spend > 150% of avg', providers: ['All'], enabled: true, channel: 'Email' },
];

// ===== COST ANALYTICS — BY MODEL =====
export const costByModel = [
    { model: 'GPT-4o', provider: 'OpenAI', requests: 24500, cost: 720.50, avgCost: 0.0294, trend: '+5.2%' },
    { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', requests: 18200, cost: 580.40, avgCost: 0.0319, trend: '+2.1%' },
    { model: 'GPT-4o-mini', provider: 'OpenAI', requests: 13700, cost: 260.00, avgCost: 0.0190, trend: '-1.8%' },
    { model: 'Gemini 2.0 Flash', provider: 'Google AI', requests: 12400, cost: 310.20, avgCost: 0.0250, trend: '+8.4%' },
    { model: 'Claude (Bedrock)', provider: 'AWS Bedrock', requests: 11200, cost: 448.90, avgCost: 0.0401, trend: '+0.9%' },
    { model: 'Gemini 1.5 Pro', provider: 'Google AI', requests: 4800, cost: 188.00, avgCost: 0.0392, trend: '-3.2%' },
    { model: 'Claude 3.5 Haiku', provider: 'Anthropic', requests: 9600, cost: 192.00, avgCost: 0.0200, trend: '+12.1%' },
    { model: 'DALL·E 3', provider: 'OpenAI', requests: 1930, cost: 255.00, avgCost: 0.1321, trend: '-0.5%' },
];

// ===== WEEKLY COMPARISON DATA =====
export const weeklyComparison = [
    { week: 'Week 1', budget: 1450, actual: 1320 },
    { week: 'Week 2', budget: 1450, actual: 1580 },
    { week: 'Week 3', budget: 1450, actual: 1410 },
    { week: 'Week 4', budget: 1450, actual: 1356 },
];

// ===== SPARKLINE DATA GENERATOR =====
export function generateSparkline(baseValue, volatility, points = 20) {
    return Array.from({ length: points }, (_, i) => ({
        x: i,
        y: baseValue + (Math.random() - 0.5) * volatility * baseValue,
    }));
}

// ===== API KEYS MOCK =====
export const apiKeys = [
    { provider: 'OpenAI', key: 'sk-proj-****************************Xm4z', color: '#10a37f', lastUsed: '2 min ago', status: 'active' },
    { provider: 'Anthropic', key: 'sk-ant-****************************8kPq', color: '#d4a27f', lastUsed: '5 min ago', status: 'active' },
    { provider: 'Google AI', key: 'AIza****************************tR2w', color: '#4285f4', lastUsed: '18 min ago', status: 'active' },
    { provider: 'AWS Bedrock', key: 'AKIA****************************Q9Lp', color: '#ff9900', lastUsed: '1 hour ago', status: 'active' },
    { provider: 'Stripe', key: 'sk_live_****************************mN7x', color: '#635bff', lastUsed: '3 hours ago', status: 'active' },
    { provider: 'Twilio', key: 'AC****************************bR4s', color: '#f22f46', lastUsed: '45 min ago', status: 'warning' },
];
