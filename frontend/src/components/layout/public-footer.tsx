import Link from 'next/link'

export function PublicFooter() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-16 mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-1.5 font-bold text-2xl tracking-tighter text-gray-900 mb-6">
                            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm shadow-md">R</div>
                            Seeder<span className="text-gray-400 font-medium">Pay</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 max-w-xs">
                            專為台灣創作者打造的收款平台。訂閱制、一次性購買、贊助打賞，一個平台搞定。
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">功能</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-600">
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">收款方式</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">訂閱管理</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">自動化管理</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">會員資料管理</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">開發者工具</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">資源</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-600">
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">價格方案</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">部落格</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">開發者文件</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">API 文件</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">金流審核準備</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4 tracking-tight">快速上手</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-600">
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">使用指南</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">MCP 整合 <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-sm font-bold">NEW</span></Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 transition-colors">Discord 社群</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm font-medium text-gray-500">
                        © {new Date().getFullYear()} Seeder Pay Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-gray-500">
                        <Link href="#" className="hover:text-gray-900 transition-colors">隱私權政策</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">使用條款</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
