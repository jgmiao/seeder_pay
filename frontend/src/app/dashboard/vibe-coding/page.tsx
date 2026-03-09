'use client';

import { useState } from 'react';
import { ArrowRight, Wand2, Copy, Check, ChevronLeft, Code, Terminal, Sparkles, ExternalLink } from 'lucide-react';

type Step = 'platform' | 'prompt' | 'code';

interface Platform {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    recommended?: boolean;
    tags: string[];
    url: string;
    systemPrompt: string;
}

const platforms: Platform[] = [
    {
        id: 'replit',
        name: 'Replit',
        recommended: true,
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#F26207]" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h6v6H4zM4 14h6v6H4zM14 4h6v6h-6zM14 9h-4v6h4v5h6v-6h-4V9z" />
            </svg>
        ),
        iconBg: 'bg-orange-50',
        description: '最強雲端 IDE，支援 MCP 一鍵安裝。讓 AI 直接幫你編寫並部署支付邏輯。',
        tags: ['MCP 整合', '雲端部署', 'Node.js/Go'],
        url: 'https://replit.com',
        systemPrompt: `你是一位全端工程師。我正在使用 Seeder Pay (一個專門為 AI 開發環境設計的支付網關) 開發一個訂閱制應用。
請幫我建立一個專案結構，包含：
1. 一個 React 前端頁面展示產品列表。
2. 使用 Seeder Pay API (http://localhost:8080/api/v1) 來處理結帳。
3. 如果環境支援 MCP (Model Context Protocol)，請優先配置 Seeder Pay MCP Server 以獲得自動化能力。

API 基礎配置：
- Base URL: http://localhost:8080/api/v1
- 租戶 ID: acct_demo_123`,
    },
    {
        id: 'lovable',
        name: 'Lovable',
        icon: (
            <svg viewBox="0 0 32 32" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#FF6B8A" />
                <path d="M16 22s-7-4.5-7-9a4.5 4.5 0 0 1 7-3.7A4.5 4.5 0 0 1 23 13c0 4.5-7 9-7 9z" fill="white" />
            </svg>
        ),
        iconBg: 'bg-pink-50',
        description: '極致美感 AI 平台。適合製作精美的 SaaS 登錄頁面與支付訂閱按鈕。',
        tags: ['shadcn/ui', 'Vite', '美型 UI'],
        url: 'https://lovable.dev',
        systemPrompt: `你是一位資深 UI/UX 設計師與 React 工程師。請為我設計一個高端的 SaaS 產品定價頁面。
技術要求：
1. 使用 shadcn/ui 和 Tailwind CSS。
2. 需要整合 Seeder Pay 的支付流程。
3. 當用戶點擊「立即訂閱」時，調用 Seeder Pay 的 API (POST /api/v1/subscriptions)。

測試帳號信息：
- Tenant ID: acct_demo_123
- API Key: test_key_demo`,
    },
    {
        id: 'cursor',
        name: 'Cursor / Windsurf',
        icon: (
            <div className="w-7 h-7 flex items-center justify-center text-blue-600">
                <Code className="w-6 h-6" />
            </div>
        ),
        iconBg: 'bg-blue-50',
        description: '本地強大的 AI 編輯器。適合深度業務邏輯編寫與自定義組件開發。',
        tags: ['本地開發', '完全支配', '多語言支援'],
        url: 'https://cursor.sh',
        systemPrompt: `我目前在本地環境開發一個項目。我需要整合 Seeder Pay (http://localhost:8080) 支付網關。
請幫我：
1. 封裝一個 API Client 用於與 Seeder Pay 通訊。
2. 實現核心模型：Product, Price, Subscription。
3. 寫一個用於跳轉到付款頁面的 React Hook。`,
    },
];

export default function VibeCodingPage() {
    const [step, setStep] = useState<Step>('platform');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const nextStep = () => {
        if (step === 'platform' && selectedPlatform) setStep('prompt');
        else if (step === 'prompt') setStep('code');
    };

    const prevStep = () => {
        if (step === 'prompt') setStep('platform');
        else if (step === 'code') setStep('prompt');
    };

    return (
        <div className="flex-1 w-full bg-[#F9FAFB] min-h-screen">
            <div className="px-8 pt-8 pb-32 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Wand2 className="w-7 h-7 text-gray-800" strokeWidth={1.8} />
                        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Vibe Coding</h1>
                        <div className="flex bg-gray-950 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Magic
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">透過 AI 引導，在 10 分鐘內完成您的支付系統對接</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-10 overflow-hidden">
                    {[
                        { id: 'platform', label: '1. 選擇平台' },
                        { id: 'prompt', label: '2. 獲取 Prompt' },
                        { id: 'code', label: '3. 整合代碼' }
                    ].map((s, idx) => (
                        <div key={s.id} className="flex items-center flex-1">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${step === s.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400'}`}>
                                {s.label}
                            </div>
                            {idx < 2 && <div className="h-px bg-gray-200 flex-1 mx-2" />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 min-h-[500px] shadow-sm relative">
                    {step === 'platform' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">您打算在何處開發？</h2>
                            <div className="grid grid-cols-3 gap-6">
                                {platforms.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p)}
                                        className={`group relative text-left border-2 rounded-2xl p-6 transition-all ${selectedPlatform?.id === p.id ? 'border-gray-900 bg-gray-50/50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/30'}`}
                                    >
                                        {p.recommended && (
                                            <span className="absolute -top-3 left-6 bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                                                推薦使用
                                            </span>
                                        )}
                                        <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            {p.icon}
                                        </div>
                                        <div className="font-bold text-[16px] text-gray-900 mb-2">{p.name}</div>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.description}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.tags.map(t => (
                                                <span key={t} className="text-[10px] bg-white border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'prompt' && selectedPlatform && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">準備好您的開發環境</h2>
                            <p className="text-sm text-gray-500 mb-8">
                                請複製下方的系統指令 (Prompt)，並直接貼給 **{selectedPlatform.name}** 的 AI 助理。
                            </p>

                            <div className="relative group">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => handleCopy(selectedPlatform.systemPrompt)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? '已複製' : '複製指令'}
                                    </button>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 pt-12 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                    {selectedPlatform.systemPrompt}
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-4 p-4 bg-gray-900 text-white rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                                    <Terminal size={20} className="text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 font-medium">下一步提示</div>
                                    <div className="text-[13px]">讓 AI 幫你初始化專案後，點擊下一步查看如何整合支付代碼。</div>
                                </div>
                                <a
                                    href={selectedPlatform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
                                >
                                    前往 {selectedPlatform.name}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    )}

                    {step === 'code' && selectedPlatform && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">整合代碼範例</h2>
                            <p className="text-sm text-gray-500 mb-8">
                                專案跑起來後，您可以要求 AI 按照以下邏輯添加支付按鈕：
                            </p>

                            <div className="space-y-6">
                                <div className="bg-gray-900 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-mono">checkout-button.tsx</span>
                                    </div>
                                    <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                                        {`const handleCheckout = async (priceId) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ price_id: priceId })
  });
  const data = await response.json();
  // 跳轉至支付頁面
  window.location.href = data.url;
};`}
                                    </pre>
                                </div>

                                <div className="p-6 border border-emerald-100 bg-emerald-50/30 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                                        <Sparkles size={16} />
                                        AI 自動化預告
                                    </h4>
                                    <p className="text-[13px] text-emerald-700/80 leading-relaxed">
                                        我們即將推出 **Seeder Pay MCP**。屆時您只需安裝 MCP Server，AI 就會自動獲取您的產品目錄、配置 API 並在您的代碼中寫入支付鏈接，完全無需手動複製。
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between pt-8 border-t border-gray-100">
                        {step !== 'platform' ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
                            >
                                <ChevronLeft size={18} />
                                返回上一步
                            </button>
                        ) : <div />}

                        <button
                            onClick={nextStep}
                            disabled={!selectedPlatform || step === 'code'}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${(!selectedPlatform || step === 'code') ? 'bg-gray-100 text-gray-300' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 active:scale-95'}`}
                        >
                            {step === 'code' ? '完成對接' : '下一步'}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[12px] text-gray-500">API 服務正常</span>
                        </div>
                        <div className="h-3 w-px bg-gray-200" />
                        <span className="text-[12px] text-gray-500">Tenant: <span className="font-mono text-gray-700">acct_demo_123</span></span>
                    </div>
                    <div className="text-[12px] text-gray-400">Need help? Join Discord</div>
                </div>
            </div>
        </div>
    );
}
