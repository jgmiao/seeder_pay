'use client';

import { Tag, Plus } from 'lucide-react';

export default function CustomerTagsPage() {
    return (
        <div className="max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-base font-medium text-gray-900">顧客標籤</h2>
                        <p className="text-sm text-gray-500 mt-1">建立標籤來分類和管理你的顧客</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        建立標籤
                    </button>
                </div>

                {/* Empty state */}
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 text-gray-300 flex items-center justify-center">
                        <Tag className="w-14 h-14" strokeWidth={1.2} />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-medium text-gray-700">還沒有標籤</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs text-center leading-relaxed">
                            建立標籤來管理和分類你的顧客，例如「VIP」、「試用」等
                        </p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        <Plus className="w-4 h-4" />
                        建立第一個標籤
                    </button>
                </div>
            </div>
        </div>
    );
}
