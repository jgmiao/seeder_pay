'use client';

import { CheckCircle, Settings } from 'lucide-react';

export default function PaymentSettingsPage() {
    return (
        <div className="max-w-4xl space-y-6">
            {/* Payment Environment Settings */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">支付環境設定</h2>
                    <p className="text-sm text-gray-500 mt-1">管理 PAYUNi 支付串接和環境設定</p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Sandbox Environment */}
                    <div className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-900">測試環境 (Sandbox)</span>
                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                                        <CheckCircle className="w-3 h-3" />
                                        已啟用
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Merchant ID：KAIK025845093924</p>
                                <p className="text-sm text-gray-400 mt-0.5">用於開發和測試，不會產生實際交易</p>
                            </div>
                        </div>
                    </div>

                    {/* Production Environment */}
                    <div className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-900">正式環境 (Production)</span>
                                    <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                        未申請
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">完成申請後可開始接受真實付款</p>
                            </div>
                            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                                <Settings className="w-4 h-4" />
                                申請正式金流帳戶
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Active Environment */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <h3 className="text-base font-medium text-gray-900 mb-4">目前啟用環境</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">測試環境</p>
                                <p className="text-xs text-gray-500">所有新訂單將使用此環境的支付設定</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400 cursor-not-allowed">↻ 切換環境</p>
                            <p className="text-xs text-gray-400">正式環境尚未申請</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Partners */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <h3 className="text-base font-medium text-gray-900">金流合作夥伴</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Recur 以下通過國際資安認證的金流服務商合作，確保每筆交易安全無虞。
                    </p>

                    <div className="space-y-4">
                        {/* PAYUNI / 統一數發 */}
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="w-16 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-xs tracking-tight">PAYUNi</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">統一數發股份有限公司</p>
                                <p className="text-xs text-gray-500 mt-0.5">PCI-DSS 4.0.1 · ISO 27001 · BS 10012</p>
                            </div>
                        </div>

                        {/* 91APP */}
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="w-16 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-xs tracking-tight">91APP</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">九易宇軒股份有限公司</p>
                                <p className="text-xs text-gray-500 mt-0.5">SOC 2 Type II · PCI-DSS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
