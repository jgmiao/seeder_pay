'use client'

import { useState, useEffect } from 'react'
import { Check, ShieldCheck, Lock, ChevronRight, HelpCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

import { use } from 'react'

export default function CheckoutPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [pageLoad, setPageLoad] = useState(true)

    const [product, setProduct] = useState<any>(null)
    const [price, setPrice] = useState<any>(null)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const prodRes = await api.get(`/products/${id}`)
                setProduct(prodRes.data)

                const pricesRes = await api.get(`/products/${id}/prices`)
                if (pricesRes.data.data && pricesRes.data.data.length > 0) {
                    setPrice(pricesRes.data.data[0])
                }
            } catch (err) {
                console.error("Failed to load product", err)
                setErrorMsg("商品載入失敗，可能已被移除或連結已失效。")
            } finally {
                setPageLoad(false)
            }
        }
        fetchProductData()
    }, [id])

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Create Customer
            const cusRes = await api.post('/customers', {
                email,
                name
            })

            // 2. Create Subscription (Mocking a successful card token)
            await api.post('/subscriptions', {
                customer_id: cusRes.data.id,
                price_id: price.id,
                token: "tok_mock_12345"
            })

            setSuccess(true)
        } catch (err) {
            console.error(err)
            alert("結帳失敗，請稍後再試")
        } finally {
            setLoading(false)
        }
    }

    if (pageLoad) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
    }

    if (errorMsg || !product || !price) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500 font-medium">{errorMsg || "無效的商品內容"}</p></div>
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-10 text-center space-y-6  animation-fade-in border border-gray-100">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                        <Check className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">付款成功！</h2>
                    <p className="text-gray-500 font-medium">感謝您的訂閱，我們已發送收據與使用指南至您的信箱。</p>
                    <div className="pt-8 border-t border-gray-100">
                        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="w-full h-12 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                            返回商家控制台
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Left side: Order Summary */}
            <div className="md:w-[45%] bg-white p-8 md:p-12 lg:p-16 border-r border-gray-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                <div className="max-w-md ml-auto h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">S</div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">Seeder Demo</span>
                    </div>

                    <div className="flex-1">
                        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 mb-6 tracking-wide uppercase">
                            {price.billing_interval === 'month' ? '月繳方案' : (price.billing_interval === 'year' ? '年繳方案' : '單次購買')}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">{product.name}</h1>

                        {product.description && (
                            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
                        )}

                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-5xl font-extrabold tracking-tight text-gray-900">NT$ {price.unit_amount.toLocaleString()}</span>
                            {price.billing_interval && <span className="text-gray-500 font-semibold text-lg">/ {price.billing_interval === 'month' ? '月' : '年'}</span>}
                        </div>

                        <ul className="space-y-4 mb-10 border-t border-gray-100 pt-8">
                            <li className="flex gap-x-4 text-base font-medium text-gray-600">
                                <Check className="h-6 w-6 flex-none text-emerald-500 bg-emerald-50 rounded-full p-1" />
                                安全且快速的結帳體驗
                            </li>
                            <li className="flex gap-x-4 text-base font-medium text-gray-600">
                                <Check className="h-6 w-6 flex-none text-emerald-500 bg-emerald-50 rounded-full p-1" />
                                及時開通您的專屬權限
                            </li>
                        </ul>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-8">
                        <div className="flex justify-between text-sm text-gray-500 font-medium">
                            <span>小計</span>
                            <span className="text-gray-900">NT$ {price.unit_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-4">
                            <span className="text-gray-900">總計 (含稅)</span>
                            <span className="text-gray-900">NT$ {price.unit_amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Payment Form */}
            <div className="md:w-[55%] bg-gray-50/50 p-8 md:p-12 lg:p-16">
                <div className="max-w-md mr-auto mt-8">
                    <form onSubmit={handleSubscribe} className="space-y-10">
                        {/* Contact Info */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">聯絡資訊</h2>
                                <HelpCircle className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-semibold">Email 信箱</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 border-gray-200 focus:ring-primary focus:border-primary shadow-sm"
                                        placeholder="andy@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 font-semibold">真實姓名 (選填)</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 border-gray-200 focus:ring-primary focus:border-primary shadow-sm"
                                        placeholder="Andy Miao"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">付款方式</h2>
                            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                                <div className="bg-indigo-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                    <div className="h-4 w-6 rounded bg-indigo-600 shrink-0"></div>
                                    <span className="font-semibold text-indigo-900 text-sm tracking-wide">信用卡 / 簽帳金融卡</span>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-semibold">信用卡卡號</Label>
                                        <div className="relative">
                                            <Input disabled type="text" className="h-12 pl-12 text-gray-500 bg-gray-50/80 border-gray-200" value="•••• •••• •••• 4242 (測試環境)" />
                                            <CreditCardIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-semibold">到期日</Label>
                                            <Input disabled type="text" className="h-12 text-gray-500 bg-gray-50/80 border-gray-200" value="12/28" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-semibold">安全碼 (CVC)</Label>
                                            <Input disabled type="password" className="h-12 text-gray-500 bg-gray-50/80 border-gray-200" value="123" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-xl bg-indigo-600 text-[15px] font-bold text-white shadow-md hover:bg-indigo-500 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex justify-between items-center px-6"
                        >
                            <div className="flex flex-col items-start leading-tight">
                                {loading ? (
                                    <span className="flex items-center gap-2"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 處理授權中...</span>
                                ) : (
                                    <>
                                        <span>NT$ {price.unit_amount.toLocaleString()}</span>
                                        <span className="text-[11px] font-medium text-indigo-200 opacity-90">包含隨付的營業稅</span>
                                    </>
                                )}
                            </div>
                            {!loading && (
                                <div className="flex items-center gap-1">
                                    立即訂閱 <ChevronRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>

                        <p className="text-xs text-center text-gray-400 mt-6 flex items-center justify-center gap-1.5 font-medium">
                            <ShieldCheck size={16} className="text-gray-400" />
                            此交易使用 SSL 256-bit 安全加密連線 (Seeder Test Gateway)
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    )
}
