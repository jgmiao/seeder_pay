'use client'

import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Users, X, Pencil, Trash2 } from 'lucide-react'
import { customersApi, Customer, formatDate } from '@/lib/api'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showCreate, setShowCreate] = useState(false)
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadCustomers = async () => {
        setLoading(true)
        try {
            const data = await customersApi.list()
            setCustomers(data)
        } catch {
            showToast('載入顧客失敗', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCustomers() }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('確定要刪除此顧客嗎？此操作無法還原。')) return
        try {
            await customersApi.delete(id)
            showToast('已刪除顧客')
            loadCustomers()
        } catch {
            showToast('刪除失敗', 'error')
        }
    }

    const filtered = customers.filter(c =>
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.name || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 max-w-[1600px] w-full">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-gray-900' : 'bg-rose-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">顧客管理</h1>
                    <p className="text-[15px] text-[#6B7280]">查看和管理所有顧客的資訊與訂閱狀態</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    新增顧客
                </button>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-8">
                <StatCard title="總顧客數" value={customers.length.toString()} />
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    type="text"
                    placeholder="搜尋顧客 Email 或名稱..."
                    className="w-full max-w-[320px] rounded-lg border border-gray-200 px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    載入中...
                </div>
            ) : customers.length === 0 ? (
                <EmptyState onAdd={() => setShowCreate(true)} />
            ) : (
                <>
                    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">顧客</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">ID</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">註冊日期</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827] text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(cus => (
                                    <tr key={cus.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="text-[14px] text-[#111827] font-medium">{cus.name || '-'}</div>
                                            <div className="text-[13px] text-[#6B7280]">{cus.email}</div>
                                        </td>
                                        <td className="py-4 px-6 text-[13px] text-[#9CA3AF] font-mono">{cus.id}</td>
                                        <td className="py-4 px-6 text-[14px] text-[#374151]">{formatDate(cus.created_at)}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-3 ml-auto">
                                                <button
                                                    onClick={() => setEditCustomer(cus)}
                                                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#374151] hover:text-[#111827] transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    編輯
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cus.id)}
                                                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 hover:text-rose-700 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    刪除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-[13px] text-[#6B7280]">顯示 {filtered.length} / {customers.length} 位顧客</div>
                </>
            )}

            {showCreate && (
                <CustomerModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => { setShowCreate(false); loadCustomers(); showToast('顧客建立成功') }}
                />
            )}
            {editCustomer && (
                <CustomerModal
                    customer={editCustomer}
                    onClose={() => setEditCustomer(null)}
                    onSuccess={() => { setEditCustomer(null); loadCustomers(); showToast('顧客已更新') }}
                />
            )}
        </div>
    )
}

function CustomerModal({ customer, onClose, onSuccess }: {
    customer?: Customer
    onClose: () => void
    onSuccess: () => void
}) {
    const [email, setEmail] = useState(customer?.email || '')
    const [name, setName] = useState(customer?.name || '')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) { setError('請填寫 Email'); return }
        setSubmitting(true)
        setError('')
        try {
            if (customer) {
                await customersApi.update(customer.id, { email: email.trim(), name: name.trim() })
            } else {
                await customersApi.create({ email: email.trim(), name: name.trim() })
            }
            onSuccess()
        } catch (err: any) {
            setError(err?.response?.data?.error || '操作失敗，請重試')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-[18px] font-semibold text-gray-900">{customer ? '編輯顧客' : '新增顧客'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">電子郵件 <span className="text-rose-500">*</span></label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">名稱（選填）</label>
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="顧客姓名"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    {error && <p className="text-rose-500 text-[13px]">{error}</p>}
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50">取消</button>
                        <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-[#111827] py-2.5 text-[14px] text-white hover:bg-black disabled:opacity-60">
                            {submitting ? '處理中...' : customer ? '儲存' : '建立'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white py-5 px-6 flex flex-col min-w-[160px]">
            <h3 className="text-[13px] font-medium text-[#6B7280] mb-2">{title}</h3>
            <div className="text-[32px] font-bold tracking-tight text-[#111827]">{value}</div>
        </div>
    )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white py-20 flex flex-col items-center justify-center text-center">
            <Users className="h-10 w-10 text-gray-300 mb-4" />
            <p className="text-[15px] font-medium text-gray-700 mb-2">尚無顧客</p>
            <p className="text-[13px] text-gray-400 mb-5">新增第一位顧客開始管理</p>
            <button onClick={onAdd} className="bg-[#111827] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-black transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                新增第一位顧客
            </button>
        </div>
    )
}
