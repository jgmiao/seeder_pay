'use client';

import { ChevronRight } from 'lucide-react';

const integrations = [
    {
        name: 'WordPress',
        description: '連接 WordPress 網站，支援 FluentCart 產品同步',
        icon: '🔵',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        available: true,
        letter: 'W',
    },
    {
        name: 'Cal.com',
        description: '讓付費會員直接預約您的時段',
        icon: '📅',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
        available: true,
        letter: 'C',
    },
    {
        name: 'FluentCommunity',
        description: '付款成功後，自動將訂閱者加入社群',
        icon: '👥',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        available: true,
        letter: 'FC',
    },
    {
        name: 'FluentCRM',
        description: '自動同步訂閱者到 FluentCRM 進行電子郵件行銷',
        icon: '✉️',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-600',
        available: true,
        letter: 'FC',
    },
    {
        name: 'Slack',
        badge: '即將推出',
        description: '當有新訂閱者時發送 Slack 頻道通知',
        icon: '💬',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        available: false,
        letter: 'S',
    },
    {
        name: 'Discord',
        badge: '即將推出',
        description: '自動為付費會員分配 Discord 身分組',
        icon: '💬',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
        available: false,
        letter: 'D',
    },
    {
        name: 'LINE',
        badge: '即將推出',
        description: '透過 LINE 官方帳號發送訂閱通知',
        icon: '💚',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        available: false,
        letter: 'L',
    },
];

const ICON_MAP: Record<string, { bg: string; text: string; initials: string }> = {
    WordPress: { bg: 'bg-blue-500', text: 'text-white', initials: 'W' },
    'Cal.com': { bg: 'bg-orange-400', text: 'text-white', initials: 'C' },
    FluentCommunity: { bg: 'bg-purple-400', text: 'text-white', initials: 'FC' },
    FluentCRM: { bg: 'bg-teal-400', text: 'text-white', initials: 'FC' },
    Slack: { bg: 'bg-purple-300', text: 'text-white', initials: 'S' },
    Discord: { bg: 'bg-indigo-400', text: 'text-white', initials: 'D' },
    LINE: { bg: 'bg-green-500', text: 'text-white', initials: 'L' },
};

// Split into 2 columns
const leftCol = integrations.filter((_, i) => i % 2 === 0);
const rightCol = integrations.filter((_, i) => i % 2 !== 0);

export default function IntegrationsPage() {
    return (
        <div className="max-w-5xl">
            <div className="grid grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-4">
                    {leftCol.map((item) => {
                        const iconInfo = ICON_MAP[item.name];
                        return (
                            <button
                                key={item.name}
                                className={`w-full flex items-center gap-4 p-5 border border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:shadow-sm transition-all text-left group ${!item.available ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl ${iconInfo.bg} ${iconInfo.text} flex items-center justify-center shrink-0 text-sm font-bold`}>
                                    {iconInfo.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.badge}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                                </div>
                                {item.available && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-gray-600 transition-colors" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    {rightCol.map((item) => {
                        const iconInfo = ICON_MAP[item.name];
                        return (
                            <button
                                key={item.name}
                                className={`w-full flex items-center gap-4 p-5 border border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:shadow-sm transition-all text-left group ${!item.available ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl ${iconInfo.bg} ${iconInfo.text} flex items-center justify-center shrink-0 text-sm font-bold`}>
                                    {iconInfo.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                                        {item.badge && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.badge}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                                </div>
                                {item.available && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-gray-600 transition-colors" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
