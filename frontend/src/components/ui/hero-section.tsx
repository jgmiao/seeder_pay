import { Button } from '@/components/ui/button'
import { ArrowRight, Activity, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-2xl text-left">
                        <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 mb-6 font-mono">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                            封測中 專為台灣創作者打造
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                            <span className="block mb-2">專注創作</span>
                            <span className="block text-gray-600">收費交給我們</span>
                        </h1>

                        <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-xl font-medium tracking-tight mb-8">
                            訂閱制、一次性購買、贊助打賞、點數制<br />
                            一個平台，搞定所有數位商業模式
                        </p>

                        <div className="font-bold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg inline-block px-4 py-2 mb-10 text-lg">
                            每月營收 10 萬內，平台費 $0
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="bg-gray-900 text-white hover:bg-gray-800 rounded-full h-14 px-8 text-base shadow-lg shadow-gray-200 font-semibold group">
                                <Link href="/dashboard">
                                    免費開始
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-gray-200 hover:bg-gray-50 text-gray-700">
                                <Link href="#features">查看功能</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg lg:max-w-none mt-10 lg:mt-0 lg:ml-auto">
                        <div className="absolute -inset-x-20 bottom-0 top-1/2 bg-gradient-to-t from-white to-transparent opacity-80 z-20 pointer-events-none"></div>

                        <div className="relative rounded-2xl bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Mockup Dashboard UI */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                                    <div className="flex items-center text-xs font-medium text-gray-500 mb-2 whitespace-nowrap"><Activity className="mr-1.5 h-3.5 w-3.5" /> 月訂閱收入 MRR</div>
                                    <div className="text-2xl font-bold text-gray-900">NT$38,400</div>
                                    <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center">↗ 15% 較上月</div>
                                </div>
                                <div className="flex-1 rounded-xl bg-gray-50 p-4 border border-gray-100 hidden sm:block">
                                    <div className="flex items-center text-xs font-medium text-gray-500 mb-2 whitespace-nowrap"><Users className="mr-1.5 h-3.5 w-3.5" /> 訂閱者</div>
                                    <div className="text-2xl font-bold text-gray-900">128</div>
                                    <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center">↗ 8 本月新增</div>
                                </div>
                                <div className="flex-1 rounded-xl bg-gray-50 p-4 border border-gray-100 hidden md:block">
                                    <div className="flex items-center text-xs font-medium text-gray-500 mb-2 whitespace-nowrap"><CreditCard className="mr-1.5 h-3.5 w-3.5" /> 本月總營收</div>
                                    <div className="text-2xl font-bold text-gray-900">NT$52,400</div>
                                    <div className="text-xs font-medium text-gray-400 mt-1 flex items-center">含一次性購買</div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-100 p-5 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-900">最近動態</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: '林小明', action: '訂閱了 專業方案', amount: 'NT$299/月', initial: '林', color: 'bg-emerald-100 text-emerald-700' },
                                        { name: '王大華', action: '購買了 進階課程', amount: 'NT$1,990', initial: '王', color: 'bg-blue-100 text-blue-700' },
                                        { name: '陳美玲', action: '贊助了', amount: 'NT$100', initial: '陳', color: 'bg-orange-100 text-orange-700' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${item.color}`}>{item.initial}</div>
                                                <span className="text-gray-900 font-medium">{item.name} <span className="text-gray-500 font-normal">{item.action}</span></span>
                                            </div>
                                            <span className="font-medium text-emerald-600">{item.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Background decorative elements */}
                        <div className="absolute -z-10 -top-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-70"></div>
                        <div className="absolute -z-10 -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-70"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
