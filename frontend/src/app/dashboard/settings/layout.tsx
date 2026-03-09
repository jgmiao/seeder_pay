'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
    { name: '基本資訊', href: '/dashboard/settings' },
    { name: '支付設定', href: '/dashboard/settings/payment' },
    { name: '整合', href: '/dashboard/settings/integrations' },
    { name: '產品分類', href: '/dashboard/settings/categories' },
    { name: '顧客標籤', href: '/dashboard/settings/tags' },
    { name: '客戶入口', href: '/dashboard/settings/portal' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex-1 w-full bg-white flex flex-col min-h-screen">
            <div className="px-8 pt-8">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">一般設定</h1>
                <p className="text-gray-500 text-sm mt-1">管理一般設定</p>

                {/* Tabs */}
                <div className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {TABS.map((tab) => {
                                const isActive = pathname === tab.href;
                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive
                                                ? 'border-gray-900 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }
                    `}
                                    >
                                        {tab.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 bg-white pb-32">
                {children}
            </div>
        </div>
    );
}
