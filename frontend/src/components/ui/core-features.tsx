import { CheckCircle2, RotateCw, Settings, BarChart3 } from 'lucide-react'

const features = [
    {
        title: '多元收費模式',
        desc: '訂閱制、一次性購買、贊助打賞、點數制，一個後台全部搞定',
        icon: <Settings className="h-6 w-6 text-indigo-600" />,
        color: 'bg-indigo-100',
        mock: (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">🔄</div>
                        <span className="font-semibold text-gray-900">月費訂閱</span>
                    </div>
                    <span className="font-bold text-gray-900">$299 / 月</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">🎁</div>
                        <span className="font-semibold text-gray-900">單次購買</span>
                    </div>
                    <span className="font-bold text-gray-900">$1,990</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">☕️</div>
                        <span className="font-semibold text-gray-900">贊助打賞</span>
                    </div>
                    <span className="font-bold text-gray-900">自訂金額</span>
                </div>
            </div>
        )
    },
    {
        title: '自動化管理',
        desc: '系統自動處理扣款、重試、催繳，你不用再手動追款',
        icon: <RotateCw className="h-6 w-6 text-rose-600" />,
        color: 'bg-rose-100',
        reverse: true,
        mock: (
            <div className="p-6 rounded-2xl border border-rose-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-gray-900">自動扣款成功</span>
                </div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {['11/01 扣款成功 (NT$299)', '12/01 扣款失敗 (餘額不足)', '12/03 自動重試成功 (+NT$299)'].map((txt, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <CheckCircle2 className={`h-5 w-5 ${i === 1 ? 'text-gray-400' : 'text-emerald-500'}`} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-100 bg-white shadow-sm content">
                                <p className="text-sm text-slate-500 font-medium">{txt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    },
    {
        title: '顧客自助入口',
        desc: '顧客自己管理訂閱、更新付款方式，減少你的客服負擔',
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
        color: 'bg-emerald-100',
        mock: (
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="bg-emerald-50 p-4 border-b border-emerald-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">U</div>
                        <div>
                            <div className="font-semibold text-gray-900">Andy Miao</div>
                            <div className="text-xs text-emerald-700">會員自助中心</div>
                        </div>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center text-sm font-medium">目前的方案 <span>專業版 ($299/月)</span></div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center text-sm font-medium">付款卡片 <span>💳 結尾 4242</span></div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button className="text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">下載收據</button>
                        <button className="text-sm font-medium px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow-sm">更新卡片</button>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: '營收數據分析',
        desc: 'MRR、ARR、流失率、LTV，關鍵指標即時追蹤',
        icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
        color: 'bg-blue-100',
        reverse: true,
        mock: (
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">年度經常性收入 (ARR)</div>
                        <div className="text-3xl font-bold text-gray-900">NT$ 845,900</div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">+24.5%</div>
                </div>
                <div className="flex items-end gap-2 h-32">
                    {[30, 45, 35, 60, 50, 80, 75, 95].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-100 to-blue-300 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        )
    }
]

export function CoreFeatures() {
    return (
        <section id="features" className="py-32 bg-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
                    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">你需要的功能，我們都有</h2>
                    <p className="text-xl leading-8 text-gray-500 font-medium">從收款到管理到分析，一站式解決方案</p>
                </div>

                <div className="space-y-32">
                    {features.map((feature, idx) => (
                        <div key={idx} className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1 w-full max-w-xl lg:max-w-none px-4 lg:px-0 text-center lg:text-left">
                                <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.color} mb-8`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">{feature.title}</h3>
                                <p className="text-xl text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>

                            <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color.replace('bg-', 'from-').replace('100', '50')} to-transparent rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl opacity-70`}></div>
                                {feature.mock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
