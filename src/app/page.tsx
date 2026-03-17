"use client";

import dynamic from "next/dynamic";
import { useQuotationStore } from "@/store/useQuotationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Save, Share2, Loader2, FilePlus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { saveQuotation } from "@/app/actions/quotation";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const { id, blocks, title, totalAmount, setTitle, setId, setBlocks, reset } = useQuotationStore();
  const [isSaving, setIsSaving] = useState(false);

  // New quotation logic on first load or manual reset
  useEffect(() => {
    if (!id) {
      reset();
    }
  }, [id, reset]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the quotation.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveQuotation(id, { title, blocks });
      if (result && result.id) {
        const isNew = !id;
        setId(result.id);
        toast.success("Quotation saved successfully!");
        
        if (isNew) {
          router.push(`/quotation/${result.id}`);
        }
      } else {
        toast.error("An error occurred while saving.");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    reset();
    router.push("/");
    toast.info("Started a new quotation.");
  };

  return (
    <main className="min-h-screen bg-[#f2f4f6]">
      <Toaster position="top-center" richColors />
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-primary font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
            Quotes
          </div>
          <div className="w-[1px] h-6 bg-slate-200 mx-2" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none bg-transparent font-semibold text-lg focus-visible:ring-0 shadow-none w-[300px]"
            placeholder="Enter quotation title"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Total</span>
            <span className="text-xl font-extrabold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="rounded-xl text-slate-600" onClick={handleNew}>
              <FilePlus className="w-4 h-4 mr-2" /> 신규
            </Button>
            <Button variant="ghost" className="rounded-xl text-slate-600">
              <Share2 className="w-4 h-4 mr-2" /> 공유
            </Button>
            <Button variant="outline" className="rounded-xl border-slate-200">
              <Download className="w-4 h-4 mr-2" /> PDF 저장
            </Button>
            <Button 
              className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md min-w-[120px]"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {id ? "수정사항 저장" : "견적서 발행"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto py-10 px-6 flex gap-8">
        <aside className="w-[300px] space-y-6 shrink-0">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-primary" /> 블록 추가
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "텍스트 블록", type: "paragraph" }, 
                { name: "가격 수량표", type: "pricingTable" }
              ].map((item) => (
                <button
                  key={item.name}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-medium text-slate-600 transition-all active:scale-[0.98]"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("insert-block", { detail: item.type }));
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section id="editor-canvas" className="flex-1 min-w-0">
          <Editor
            onChange={setBlocks}
            initialContent={id ? blocks : undefined}
          />
        </section>
      </div>
    </main>
  );
}
