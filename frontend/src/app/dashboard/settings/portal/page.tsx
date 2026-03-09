'use client';

import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CustomerPortalPage() {
    return (
        <div className="max-w-4xl space-y-6 pb-24">
            {/* Portal Settings */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-base font-medium text-gray-900">客戶入口設定</h2>
                    <p className="text-sm text-gray-500 mt-1">設定顧客自助服務入口頁面的相關選項</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Portal URL */}
                    <div className="space-y-2">
                        <Label>客戶入口網址</Label>
                        <div className="flex gap-2">
                            <Input
                                value="https://seeder-e2e-demo.seeder.tw/portal"
                                disabled
                                className="bg-gray-50 text-gray-500 h-11 flex-1"
                            />
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                                複製連結
                            </button>
                        </div>
                    </div>

                    {/* Enable portal */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">啟用客戶入口</Label>
                            <p className="text-xs text-gray-500">啟用後，顧客可以自助管理訂閱和訂單</p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    {/* Allow cancel */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">允許顧客取消訂閱</Label>
                            <p className="text-xs text-gray-500">允許顧客自行取消當前的訂閱方案</p>
                        </div>
                        <Switch />
                    </div>

                    {/* Allow pause */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">允許顧客暫停訂閱</Label>
                            <p className="text-xs text-gray-500">允許顧客在入口暫停訂閱，暫停期間不會產生費用</p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>

            {/* Fixed bottom action bar for save button */}
            <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-end px-8 z-10">
                <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>儲存</span>
                </button>
            </div>
        </div>
    );
}
