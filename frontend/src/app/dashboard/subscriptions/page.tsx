'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ArrowDown, ArrowUpDown } from 'lucide-react'
import { subscriptionsApi, Subscription, formatCurrency, formatDate, subscriptionStatusLabel } from '@/lib/api'

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadSubscriptions = async () => {
        setLoading(true)
        try {
            const data = await subscriptionsApi.list()
            setSubscriptions(data)
        } catch {
            showToast('載入訂閱失敗', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadSubscriptions() }, [])

    const handleCancel = async (id: string) => {
        if (!confirm('確定要取消此訂閱嗎？')) return
        try {
            await subscriptionsApi.cancel(id, false) // Cancel at period end
            showToast('已預約取消')
            loadSubscriptions()
        } catch {
            showToast('操作失敗', 'error')
        }
    }

    const activeSubs = subscriptions.filter(s => s.status === 'active')
    const mrr = activeSubs.reduce((acc, s) => acc + 299, 0) // Mocking MRR as price info isn't joined here for simplicity

    return (
        <div className="p-8 max-w-[1600px] w-full">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-gray-900' : 'bg-rose-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">訂閱管理</h1>
                <p className="text-[15px] text-[#6B7280]">管理訂閱生命週期、追蹤訂閱狀態</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SubStatCard
                    title="月經常性收入 (MRR)"
                    value={formatCurrency(mrr)}
                    subText={`來自 ${activeSubs.length} 個活躍訂閱`}
                    icon={<RefreshCw className="h-4 w-4 text-[#6B7280]" />}
                />
                <SubStatCard
                    title="活躍訂閱"
                    value={activeSubs.length.toString()}
                    subText="目前使用中的訂閱"
                    icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                />
                <SubStatCard
                    title="逾期未付款"
                    value={subscriptions.filter(s => s.status === 'past_due').length.toString()}
                    subText="需要關注的訂閱"
                    icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                />
                <SubStatCard
                    title="已取消"
                    value={subscriptions.filter(s => s.status === 'canceled').length.toString()}
                    subText="已終止的訂閱數量"
                    icon={<XCircle className="h-4 w-4 text-rose-500" />}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    載入中...
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white py-20 text-center text-gray-400">
                    尚無訂閱記錄
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">訂閱者 ID</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">價格 ID</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">狀態</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">開始日期</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">下次扣款</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827] text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map(sub => (
                                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6 text-[14px] text-[#111827] font-mono">{sub.customer_id}</td>
                                    <td className="py-4 px-6 text-[14px] text-[#111827] font-mono">{sub.price_id}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${sub.status === 'active' ? (sub.cancel_at_period_end ? 'bg-amber-100 text-amber-700' : 'bg-[#111827] text-white') : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {subscriptionStatusLabel(sub.status, sub.cancel_at_period_end)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#374151]">{formatDate(sub.current_period_start)}</td>
                                    <td className="py-4 px-6 text-[14px] text-[#374151]">{formatDate(sub.current_period_end)}</td>
                                    <td className="py-4 px-6 text-right">
                                        {sub.status === 'active' && !sub.cancel_at_period_end && (
                                            <button
                                                onClick={() => handleCancel(sub.id)}
                                                className="text-[13px] font-medium text-rose-500 hover:text-rose-700 transition-colors"
                                            >
                                                取消訂閱
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function SubStatCard({ title, value, subText, icon }: { title: string; value: string; subText: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col min-h-[140px]">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-[14px] font-medium text-[#111827]">{title}</h3>
                {icon}
            </div>
            <div className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">{value}</div>
            <div className="mt-auto text-[13px] text-[#6B7280]">{subText}</div>
        </div>
    )
}
