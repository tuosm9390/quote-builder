"use client";

import { useQuotationStore } from "@/store/useQuotationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Save, Loader2, FilePlus, Trash2, Send, CheckCircle, Clock, ChevronLeft, Info, Settings } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { saveQuotation, updateStatus, softDeleteQuotation } from "@/app/actions/quotation";
import { exportToPDF } from "@/lib/export-pdf";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuotationA4Editor from "@/components/editor/QuotationA4Editor";

export default function QuotationEditorContainer() {
  const router = useRouter();
  const { id, blocks, title, totalAmount, status, setTitle, setId, setBlocks, setStatus, reset, isEditable } = useQuotationStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const editable = isEditable() && !isExporting;

  // Initialize blocks for new quotation if empty
  useEffect(() => {
    if (!id && blocks.length === 0) {
      // @ts-ignore
      useQuotationStore.getState().syncToBlocks();
    }
  }, [id, blocks.length]);

  const handleExport = async () => {
    setIsExporting(true);
    toast.info("PDF 생성 중... 잠시만 기다려주세요.");
    
    setTimeout(async () => {
      try {
        await exportToPDF("editor-canvas", `${title || "quotation"}.pdf`);
        toast.success("PDF가 저장되었습니다.");
      } catch (error) {
        toast.error("PDF 생성 실패");
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("견적서 제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveQuotation(id, { title, blocks });
      if (result && result.id) {
        const isNew = !id;
        setId(result.id);
        toast.success("견적서가 저장되었습니다.");
        
        if (isNew) {
          router.push(`/quotation/${result.id}`);
        }
      } else {
        toast.error("저장 중 오류가 발생했습니다.");
      }
    } catch (e: any) {
      toast.error(e.message || "저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    
    setIsUpdatingStatus(true);
    try {
      await updateStatus(id, newStatus);
      setStatus(newStatus);
      toast.success(`상태가 ${newStatus}로 변경되었습니다.`);
    } catch (e: any) {
      toast.error("상태 변경 실패");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("정말 이 견적서를 삭제하시겠습니까?")) return;
    
    try {
      await softDeleteQuotation(id);
      toast.success("견적서가 삭제되었습니다.");
      reset();
      router.push("/");
    } catch (e: any) {
      toast.error("삭제 실패");
    }
  };

  const handleNew = () => {
    reset();
    router.push("/quotation/new");
    toast.info("새 견적서 작성을 시작합니다.");
  };

  return (
    <main className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header Bar */}
      <header className="h-[80px] w-full bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!editable}
                className="border-none bg-transparent font-black text-2xl focus-visible:ring-0 shadow-none w-[400px] p-0 h-9 tracking-tight"
                placeholder="견적서 제목 입력"
              />
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                status === "DRAFT" ? "bg-slate-100 text-slate-500" : 
                status === "SENT" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
              }`}>
                {status}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-0.5 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 최종 수정: {new Date().toLocaleDateString()}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span>ID: {id || "New Quotation"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Estimated Total</span>
            <span className="text-2xl font-black text-slate-900 italic tracking-tighter">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all" onClick={handleNew}>
              <FilePlus className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-5 h-5" />
            </Button>

            {editable && (
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all" onClick={handleDelete} disabled={!id}>
                <Trash2 className="w-5 h-5" />
              </Button>
            )}

            <div className="w-2" />
            
            {status === "DRAFT" ? (
              <Button 
                className="rounded-full bg-slate-900 hover:bg-black text-white px-8 font-black text-sm h-11 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                onClick={handleSave}
                disabled={isSaving || isExporting}
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {id ? "저장하기" : "발행하기"}
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="rounded-full border-2 border-slate-900 text-slate-900 px-8 font-black text-sm h-11 transition-all"
                onClick={() => handleStatusUpdate("ACCEPTED")}
                disabled={isUpdatingStatus || status === "ACCEPTED"}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> 수락됨
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor Area (Work Area) */}
        <section 
          id="editor-canvas" 
          className="flex-1 overflow-auto bg-[#f8f9fa] border-r border-slate-100"
        >
          <div className="py-12">
            <QuotationA4Editor />
          </div>
        </section>

        {/* Right: Feature Area (Empty for now) */}
        <aside className="flex-1 bg-white flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-[320px] space-y-6 opacity-20">
            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
              <Settings className="w-10 h-10 text-slate-300 animate-spin-slow" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-slate-900 uppercase tracking-widest">Workspace</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                견적서 관리 및 추가 기능이<br />이곳에 배치될 예정입니다.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {!editable && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full flex items-center gap-3 text-sm font-bold shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4">
          <Info className="w-4 h-4 text-slate-400" />
          발행 완료된 견적서는 수정할 수 없습니다. (조회 전용)
        </div>
      )}
    </main>
  );
}
