import { PenTool, Laptop, Blocks, Users2 } from 'lucide-react'

const useCases = [
    {
        title: '內容創作者',
        desc: '經營付費電子報、會員專屬內容',
        icon: <PenTool className="h-6 w-6 text-indigo-600" />,
        color: 'bg-indigo-50'
    },
    {
        title: '線上課程',
        desc: '銷售課程、訂閱制學習方案',
        icon: <Laptop className="h-6 w-6 text-orange-600" />,
        color: 'bg-orange-50'
    },
    {
        title: 'SaaS 產品',
        desc: '軟體訂閱、API 用量計費',
        icon: <Blocks className="h-6 w-6 text-blue-600" />,
        color: 'bg-blue-50'
    },
    {
        title: '社群會員',
        desc: '付費社群、會員權益管理',
        icon: <Users2 className="h-6 w-6 text-emerald-600" />,
        color: 'bg-emerald-50'
    }
]

export function FeatureCards() {
    return (
        <section id="usecases" className="py-24 bg-gray-50/50 border-y border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">適合各種使用場景</h2>
                    <p className="text-lg leading-8 text-gray-500 font-medium">不管你是創作者、教育者還是開發者</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((uc, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`inline-flex items-center justify-center p-3 rounded-xl ${uc.color} mb-6`}>
                                {uc.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{uc.title}</h3>
                            <p className="text-gray-500 font-medium">{uc.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
