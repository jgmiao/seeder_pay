"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Repeat,
    Users,
    Package,
    Tag,
    Wand2,
    FileBox,
    Globe,
    Settings,
    Code,
    HelpCircle,
    MoreVertical,
    Box
} from 'lucide-react'

export function Sidebar() {
    const pathname = usePathname()

    const navGroups = [
        {
            title: null,
            items: [
                { href: '/dashboard', icon: LayoutDashboard, label: '總覽' },
            ]
        },
        {
            title: '銷售',
            items: [
                { href: '/dashboard/orders', icon: FileText, label: '訂單' },
                { href: '/dashboard/subscriptions', icon: Repeat, label: '訂閱' },
                { href: '/dashboard/customers', icon: Users, label: '顧客' },
            ]
        },
        {
            title: '商品',
            items: [
                { href: '/dashboard/products', icon: Package, label: '產品/方案' },
                { href: '/dashboard/promotions', icon: Tag, label: '優惠促銷' },
            ]
        },
        {
            title: '工具',
            items: [
                { href: '/dashboard/vibe-coding', icon: Wand2, label: 'Vibe Coding', badge: 'New' },
            ]
        },
        {
            title: '我的網站',
            items: [
                { href: '/dashboard/articles', icon: FileBox, label: '文章管理' },
                { href: '/dashboard/site-settings', icon: Globe, label: '網站設定' },
            ]
        }
    ]

    const bottomNavItems = [
        { href: '/dashboard/settings', icon: Settings, label: '設定' },
        { href: '/dashboard/developer', icon: Code, label: '開發者' },
        { href: '/dashboard/docs', icon: HelpCircle, label: '說明文件' },
    ]

    return (
        <div className="flex bg-[#F9FAFA] h-screen w-[240px] flex-col border-r border-[#E5E7EB] shrink-0">
            <div className="flex h-[72px] items-center px-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#111827] flex items-center justify-center text-white">
                        <Box size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[#111827] text-sm leading-tight">Seeder Pay</span>
                        <span className="text-[11px] text-gray-500 leading-tight">訂閱管理系統</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto w-full">
                <div className="px-3 py-2 space-y-6">
                    {navGroups.map((group, index) => (
                        <div key={index} className="space-y-1">
                            {group.title && (
                                <div className="px-3 py-1 text-[11px] font-medium text-gray-500 mb-1">
                                    {group.title}
                                </div>
                            )}
                            <div className="space-y-[2px]">
                                {group.items.map((item) => {
                                    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex justify-between items-center px-3 py-2 text-[13px] rounded-md transition-colors ${active
                                                ? 'bg-white text-[#111827] font-medium shadow-sm ring-1 ring-gray-200/50'
                                                : 'text-gray-600 hover:bg-gray-100/80 hover:text-[#111827]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={16} className={active ? 'text-[#111827]' : 'text-gray-500'} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-700">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="shrink-0 p-3 flex flex-col gap-1 mt-auto">
                <div className="space-y-[2px] mb-4">
                    {bottomNavItems.map((item) => {
                        const active = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded-md transition-colors ${active
                                    ? 'bg-white text-[#111827] font-medium shadow-sm ring-1 ring-gray-200/50'
                                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-[#111827]'
                                    }`}
                            >
                                <item.icon size={16} className={active ? 'text-[#111827]' : 'text-gray-500'} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                <button className="flex items-center px-3 py-2 hover:bg-gray-100/80 rounded-md transition-colors w-full group">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="h-7 w-7 rounded-sm bg-gray-200 flex items-center justify-center text-[13px] font-medium text-gray-700 shrink-0">
                            J
                        </div>
                        <div className="flex flex-col items-start truncate text-left">
                            <span className="font-medium text-[#111827] text-[13px] leading-tight">jiaguosmile</span>
                            <span className="text-[11px] text-gray-500 leading-tight truncate w-full">jiaguosmile@163.com</span>
                        </div>
                    </div>
                    <MoreVertical size={16} className="text-gray-400 group-hover:text-gray-600 shrink-0 ml-1" />
                </button>
            </div>
        </div>
    )
}
