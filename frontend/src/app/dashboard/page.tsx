'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, TrendingUp, Users, ShoppingCart, CreditCard } from 'lucide-react'
import { statsApi, StatsOverview, formatCurrency } from '@/lib/api'

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsOverview | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await statsApi.overview()
                setStats(data)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-gray-400 gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                載入統計數據中...
            </div>
        )
    }

    return (
        <div className="p-8 max-w-[1600px] w-full">
            <div className="mb-10">
                <h1 className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">總覽</h1>
                <p className="text-[15px] text-[#6B7280]">歡迎回來，這是您目前的業務概況</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <DashboardStatCard
                    title="總營收"
                    value={formatCurrency(stats?.total_revenue || 0)}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    trend="+12.5%"
                    trendUp={true}
                />
                <DashboardStatCard
                    title="月經常性收入 (MRR)"
                    value={formatCurrency(stats?.mrr || 0)}
                    icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                    trend="+8.2%"
                    trendUp={true}
                />
                <DashboardStatCard
                    title="活躍訂閱"
                    value={stats?.active_subscribers?.toString() || '0'}
                    icon={<Users className="h-5 w-5 text-[#111827]" />}
                />
                <DashboardStatCard
                    title="總訂單數"
                    value={stats?.total_orders?.toString() || '0'}
                    icon={<ShoppingCart className="h-5 w-5 text-[#111827]" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 min-h-[400px] flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#111827] mb-6">營收趨勢</h3>
                    <div className="mt-auto flex items-end justify-between h-[200px] px-4">
                        {[40, 65, 45, 90, 75, 55, 80].map((h, i) => (
                            <div key={i} className="w-12 bg-gray-50 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-[#111827] rounded-t-lg transition-all duration-500 group-hover:bg-black"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                    <h3 className="text-[16px] font-bold text-[#111827] mb-6">待處理事項</h3>
                    <div className="space-y-4">
                        <TodoItem label="待付款發票" count={stats?.pending_invoices || 0} />
                        <TodoItem label="逾期訂閱" count={0} color="text-rose-500" />
                        <TodoItem label="本月新顧客" count={stats?.total_customers || 0} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function DashboardStatCard({ title, value, icon, trend, trendUp }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                {trend && (
                    <span className={`text-[12px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-[14px] font-medium text-[#6B7280] mb-1">{title}</h3>
            <div className="text-[28px] font-bold text-[#111827] tracking-tight">{value}</div>
        </div>
    )
}

function TodoItem({ label, count, color = 'text-[#111827]' }: { label: string; count: number; color?: string }) {
    return (
        <div className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-[14px] text-gray-600">{label}</span>
            <span className={`text-[16px] font-bold ${color}`}>{count}</span>
        </div>
    )
}
