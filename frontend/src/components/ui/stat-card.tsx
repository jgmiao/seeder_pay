import { ArrowUpRight } from 'lucide-react'

interface StatCardProps {
    title: string;
    value: string;
    linkText: string;
    subText: string;
}

export function StatCard({ title, value, linkText, subText }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 flex flex-col min-h-[160px]">
            <h3 className="text-[13px] font-medium text-[#6B7280] mb-3">{title}</h3>
            <div className="text-[28px] font-bold text-[#111827] mb-6 tracking-tight">
                {value}
            </div>
            <div className="mt-auto space-y-1">
                <div className="flex items-center text-[13px] font-medium text-[#374151] hover:text-black cursor-pointer transition-colors">
                    {linkText}
                    <ArrowUpRight className="ml-1 h-4 w-4 text-[#6B7280]" strokeWidth={2.5} />
                </div>
                <div className="text-[13px] text-[#9CA3AF]">
                    {subText}
                </div>
            </div>
        </div>
    )
}
