import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PublicNav() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-2xl tracking-tighter text-gray-900">
                            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm shadow-md">R</div>
                            Seeder<span className="text-gray-400 font-medium">Pay</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">功能</Link>
                        <Link href="#usecases" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">了解更多</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">價格方案</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">資源</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        登入
                    </Link>
                    <Button asChild className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-5 shadow-sm">
                        <Link href="/dashboard">免費開始</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
