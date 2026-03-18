import { getQuotations } from "@/app/actions/quotation";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, Send, CheckCircle, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const quotations = await getQuotations();

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === "DRAFT").length,
    sent: quotations.filter(q => q.status === "SENT").length,
    accepted: quotations.filter(q => q.status === "ACCEPTED").length,
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-[#f2f4f6]">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quotes Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="견적서 검색..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-[240px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Link href="/quotation/new">
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md px-5 h-10 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-4 h-4 mr-2" /> 새 견적서 작성
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "전체 견적서", value: stats.total, icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
            { label: "작성 중", value: stats.draft, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "발송됨", value: stats.sent, icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "수락 완료", value: stats.accepted, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-slate-900">최근 견적서 내역</h2>
            <div className="text-sm text-slate-400 font-medium">총 {quotations.length}건</div>
          </div>

          <div className="divide-y divide-slate-50">
            {quotations.length > 0 ? (
              quotations.map((quotation) => (
                <Link 
                  key={quotation.id} 
                  href={`/quotation/${quotation.id}`}
                  className="flex items-center justify-between px-8 py-6 hover:bg-slate-50/80 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-2xl ${
                      quotation.status === "DRAFT" ? "bg-slate-100 text-slate-400" :
                      quotation.status === "SENT" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-primary transition-colors">
                        {quotation.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          {quotation.status === "DRAFT" && <Clock className="w-3.5 h-3.5" />}
                          {quotation.status === "SENT" && <Send className="w-3.5 h-3.5 text-blue-500" />}
                          {quotation.status === "ACCEPTED" && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                          {quotation.status}
                        </span>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <span>{formatDate(quotation.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-tight mb-0.5">Total Amount</div>
                      <div className="text-xl font-extrabold text-slate-900">
                        {formatCurrency(quotation.totalAmount)}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30">
                <div className="bg-slate-100 p-6 rounded-[32px] mb-6">
                  <FileText className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-lg mb-6">아직 작성된 견적서가 없습니다.</p>
                <Link href="/quotation/new">
                  <Button variant="outline" className="rounded-xl border-slate-200 hover:border-primary hover:text-primary transition-all font-bold px-8 h-12">
                    첫 견적서 만들기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
