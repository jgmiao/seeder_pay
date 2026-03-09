'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, FileText } from 'lucide-react'
import { invoicesApi, Invoice, formatCurrency, formatDate } from '@/lib/api'

export default function OrdersPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await invoicesApi.list()
                setInvoices(data)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const totalPaid = invoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? inv.amount_paid : 0), 0)

    return (
        <div className="p-8 max-w-[1600px] w-full">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">訂單管理</h1>
                <p className="text-[15px] text-[#6B7280]">查看和管理所有訂單與付款記錄</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="總訂單數" value={invoices.length.toString()} subText="包含所有狀態的訂單" />
                <StatCard title="累積總營收" value={formatCurrency(totalPaid)} subText="已完成付款的訂單總額" />
                <StatCard title="待付款" value={invoices.filter(i => i.status === 'open').length.toString()} subText="尚未完成付款的訂單" />
                <StatCard title="已完成" value={invoices.filter(i => i.status === 'paid').length.toString()} subText="已完成付款的訂單" />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    載入中...
                </div>
            ) : invoices.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white py-20 text-center text-gray-400">
                    尚無訂單記錄
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">訂單編號</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">顧客 ID</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">金額</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">狀態</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">建立時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-[14px] text-[#111827] font-mono">{inv.id}</td>
                                    <td className="py-4 px-6 text-[14px] text-[#6B7280] font-mono">{inv.customer_id}</td>
                                    <td className="py-4 px-6 text-[14px] text-[#111827] font-medium">{formatCurrency(inv.amount_due)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${inv.status === 'paid' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {inv.status === 'paid' ? '已付款' : inv.status === 'open' ? '待付款' : '已失效'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#374151]">{formatDate(inv.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function StatCard({ title, value, subText }: { title: string; value: string; subText: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white py-5 px-6 flex flex-col">
            <h3 className="text-[13px] font-medium text-[#6B7280] mb-2">{title}</h3>
            <div className="text-[28px] font-bold tracking-tight text-[#111827] mb-1">{value}</div>
            <div className="text-[12px] text-[#9CA3AF]">{subText}</div>
        </div>
    )
}
