'use client';

import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsBasicInfoPage() {
    return (
        <div className="max-w-4xl relative">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">商家基本資訊</h2>
                    <p className="text-sm text-gray-500 mt-1">管理你的商家資訊</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="domain">平台網域</Label>
                            <Input
                                id="domain"
                                value="seeder-e2e-demo.seeder.tw"
                                disabled
                                className="bg-gray-50 text-gray-500 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brandName">品牌名稱</Label>
                            <Input
                                id="brandName"
                                defaultValue="Seeder Pay"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">聯絡電子信箱</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue="seeder-e2e-demo@seeder.tw"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">啟用新顧客自動建立帳號密碼</Label>
                            <p className="text-sm text-gray-500">啟用後，系統將自動為新顧客生成並發送帳號密碼。</p>
                        </div>
                        <Switch defaultChecked />
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
