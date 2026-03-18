"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/useQuotationStore";
import QuotationEditorContainer from "@/components/editor/QuotationEditorContainer";

interface QuotationEditorWrapperProps {
  quotation: {
    id: string;
    title: string;
    blocks: any;
    totalAmount: number;
    status: string;
  };
}

export default function QuotationEditorWrapper({
  quotation,
}: QuotationEditorWrapperProps) {
  const { setId, setTitle, setBlocks, setStatus, calculateTotal } = useQuotationStore();

  useEffect(() => {
    setId(quotation.id);
    setTitle(quotation.title);
    setBlocks(quotation.blocks as any[]);
    setStatus(quotation.status);
    calculateTotal();
  }, [quotation, setId, setTitle, setBlocks, setStatus, calculateTotal]);

  return <QuotationEditorContainer />;
}
