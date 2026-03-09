'use client'

import { useEffect, useState } from 'react'
import { Plus, Tag, RefreshCw, X, Trash2, Calendar, Percent, Banknote } from 'lucide-react'
import { promoCodesApi, PromoCode, formatDate } from '@/lib/api'

export default function PromotionsPage() {
    const [promos, setPromos] = useState<PromoCode[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadPromos = async () => {
        setLoading(true)
        try {
            const data = await promoCodesApi.list()
            setPromos(data)
        } catch {
            showToast('載入失敗', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadPromos() }, [])

    const handleToggle = async (id: string, current: number) => {
        try {
            await promoCodesApi.toggle(id, current === 0)
            showToast('已更新狀態')
            loadPromos()
        } catch {
            showToast('操作失敗', 'error')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('確定要刪除此優惠碼嗎？')) return
        try {
            await promoCodesApi.delete(id)
            showToast('已刪除優惠碼')
            loadPromos()
        } catch {
            showToast('刪除失敗', 'error')
        }
    }

    return (
        <div className="p-8 max-w-[1600px] w-full">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-gray-900' : 'bg-rose-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">優惠促銷</h1>
                    <p className="text-[15px] text-[#6B7280]">建立與管理折扣碼和推廣碼</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    建立優惠碼
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    載入中...
                </div>
            ) : promos.length === 0 ? (
                <EmptyState onAdd={() => setShowCreate(true)} />
            ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">優惠代碼</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">類型</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">折扣</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">使用次數</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">有效期至</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">狀態</th>
                                <th className="py-4 px-6 font-medium text-[13px] text-[#111827] text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map(p => (
                                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="text-[14px] font-mono font-bold text-[#111827]">{p.code}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[12px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">
                                            {p.discount_type === 'percent' ? '百分比' : '固定金額'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#111827]">
                                        {p.discount_type === 'percent' ? `${p.discount_value}%` : `$${p.discount_value}`}
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#374151]">
                                        {p.used_count} / {p.max_uses || '∞'}
                                    </td>
                                    <td className="py-4 px-6 text-[14px] text-[#374151]">
                                        {p.expires_at ? formatDate(p.expires_at) : '永久有效'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleToggle(p.id, p.active)}
                                            className={`px-2 py-1 rounded-full text-[11px] font-bold ${p.active === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {p.active === 1 ? '啟用中' : '已停用'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-rose-500 hover:text-rose-700 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreate && (
                <CreateModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => { setShowCreate(false); loadPromos(); showToast('優惠碼已建立') }}
                />
            )}
        </div>
    )
}

function CreateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [code, setCode] = useState('')
    const [type, setType] = useState('percent')
    const [value, setValue] = useState('')
    const [maxUses, setMaxUses] = useState('')
    const [expires, setExpires] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code) return
        setSubmitting(true)
        try {
            await promoCodesApi.create({
                code,
                discount_type: type,
                discount_value: parseInt(value) || 0,
                max_uses: maxUses ? parseInt(maxUses) : null,
                expires_at: expires ? new Date(expires).toISOString() : null,
            })
            onSuccess()
        } catch {
            alert('建立失敗')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-[18px] font-semibold text-gray-900">建立優惠碼</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">代碼</label>
                        <input
                            value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="FALL2024"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">類型</label>
                            <select
                                value={type} onChange={e => setType(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option value="percent">百分比 (%)</option>
                                <option value="fixed">固定金額</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">數值</label>
                            <input
                                type="number" value={value} onChange={e => setValue(e.target.value)}
                                placeholder="10"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">最高使用次數</label>
                            <input
                                type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)}
                                placeholder="不限"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">過期日期</label>
                            <input
                                type="date" value={expires} onChange={e => setExpires(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50">取消</button>
                        <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-[#111827] py-2.5 text-[14px] text-white hover:bg-black disabled:opacity-60">
                            {submitting ? '建立中...' : '建立'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
            <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Tag className="h-6 w-6 text-[#9CA3AF] transform -rotate-90" />
            </div>
            <h3 className="text-[18px] font-bold text-[#111827] mb-2 tracking-tight">尚無優惠活動</h3>
            <p className="text-[14px] text-[#6B7280] max-w-sm mb-8 leading-relaxed">建立折扣碼來吸引新顧客，或提供現有訂閱者續約優惠。</p>
            <button onClick={onAdd} className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                建立第一個優惠
            </button>
        </div>
    )
}
