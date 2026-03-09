'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, RefreshCw, X, ChevronRight } from 'lucide-react'
import { productsApi, Product, Price, formatCurrency, billingIntervalLabel } from '@/lib/api'

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [prices, setPrices] = useState<Record<string, Price[]>>({})
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadProducts = async () => {
        setLoading(true)
        try {
            const prods = await productsApi.list()
            setProducts(prods)
            // Load prices for each product
            const priceMap: Record<string, Price[]> = {}
            await Promise.all(prods.map(async (p) => {
                try {
                    priceMap[p.id] = await productsApi.listPrices(p.id)
                } catch {
                    priceMap[p.id] = []
                }
            }))
            setPrices(priceMap)
        } catch {
            showToast('載入產品失敗', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadProducts() }, [])

    const handleArchive = async (id: string) => {
        if (!confirm('確定要停用此產品嗎？')) return
        try {
            await productsApi.archive(id)
            showToast('產品已停用')
            loadProducts()
        } catch {
            showToast('操作失敗', 'error')
        }
    }

    const activeProducts = products.filter(p => p.active === 1)

    return (
        <div className="p-8 max-w-[1600px] w-full">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === 'success' ? 'bg-gray-900' : 'bg-rose-500'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">產品</h1>
                    <p className="text-[15px] text-[#6B7280]">管理您的產品，包含訂閱和一次性購買</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    新增產品
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    載入中...
                </div>
            ) : activeProducts.length === 0 ? (
                <EmptyState onAdd={() => setShowCreate(true)} />
            ) : (
                <>
                    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">產品</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">類型</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">價格</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827]">週期</th>
                                    <th className="py-4 px-6 font-medium text-[13px] text-[#111827] text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeProducts.map(prod => {
                                    const prodPrices = prices[prod.id] || []
                                    const mainPrice = prodPrices[0]
                                    return (
                                        <tr key={prod.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="text-[14px] text-[#111827] font-medium">{prod.name}</div>
                                                {prod.description && (
                                                    <div className="text-[12px] text-[#9CA3AF] mt-0.5">{prod.description}</div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center rounded-full bg-[#111827] px-2.5 py-0.5 text-[12px] font-medium text-white">
                                                    {mainPrice?.billing_interval ? '訂閱' : '一次性'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#111827] font-medium">
                                                {mainPrice ? formatCurrency(mainPrice.unit_amount) : '-'}
                                            </td>
                                            <td className="py-4 px-6 text-[14px] text-[#6B7280]">
                                                {mainPrice ? billingIntervalLabel(mainPrice.billing_interval, mainPrice.interval_count) : '-'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => setEditProduct(prod)}
                                                        className="flex items-center gap-1.5 text-[13px] font-medium text-[#374151] hover:text-[#111827] transition-colors"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        編輯
                                                    </button>
                                                    <button
                                                        onClick={() => handleArchive(prod.id)}
                                                        className="flex items-center gap-1.5 text-[13px] font-medium text-[#9CA3AF] hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        停用
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-[13px] text-[#6B7280]">
                        顯示 {activeProducts.length} 個產品
                    </div>
                </>
            )}

            {/* Create Modal */}
            {showCreate && (
                <ProductModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => { setShowCreate(false); loadProducts(); showToast('產品建立成功') }}
                />
            )}

            {/* Edit Modal */}
            {editProduct && (
                <ProductModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSuccess={() => { setEditProduct(null); loadProducts(); showToast('產品已更新') }}
                />
            )}
        </div>
    )
}

function ProductModal({ product, onClose, onSuccess }: {
    product?: Product
    onClose: () => void
    onSuccess: () => void
}) {
    const [name, setName] = useState(product?.name || '')
    const [description, setDescription] = useState(product?.description || '')
    const [amount, setAmount] = useState('')
    const [interval, setInterval] = useState('month')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) { setError('請填寫產品名稱'); return }
        setSubmitting(true)
        setError('')
        try {
            if (product) {
                await productsApi.update(product.id, { name: name.trim(), description: description.trim() })
            } else {
                const prod = await productsApi.create({ name: name.trim(), description: description.trim() })
                if (amount && parseInt(amount) > 0) {
                    await productsApi.createPrice({
                        product_id: prod.id,
                        unit_amount: parseInt(amount),
                        billing_interval: interval === 'onetime' ? '' : interval,
                        currency: 'TWD',
                    })
                }
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
                    <h2 className="text-[18px] font-semibold text-gray-900">{product ? '編輯產品' : '新增產品'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">產品名稱 <span className="text-rose-500">*</span></label>
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="例：進階會員方案"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">描述（選填）</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="簡短描述此產品..."
                            rows={2}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                    </div>
                    {!product && (
                        <>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">價格（NT$，選填）</label>
                                <input
                                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                    placeholder="例：990"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">計費週期</label>
                                <select
                                    value={interval} onChange={e => setInterval(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                >
                                    <option value="month">月付</option>
                                    <option value="year">年付</option>
                                    <option value="onetime">一次性</option>
                                </select>
                            </div>
                        </>
                    )}
                    {error && <p className="text-rose-500 text-[13px]">{error}</p>}
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">取消</button>
                        <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-[#111827] py-2.5 text-[14px] text-white hover:bg-black disabled:opacity-60 transition-colors">
                            {submitting ? '處理中...' : product ? '儲存' : '建立'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white py-20 flex flex-col items-center justify-center text-center">
            <Package className="h-10 w-10 text-gray-300 mb-4" />
            <p className="text-[15px] font-medium text-gray-700 mb-2">尚無產品</p>
            <p className="text-[13px] text-gray-400 mb-5">建立您的第一個訂閱或一次性商品</p>
            <button onClick={onAdd} className="bg-[#111827] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-black transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                新增第一個產品
            </button>
        </div>
    )
}
