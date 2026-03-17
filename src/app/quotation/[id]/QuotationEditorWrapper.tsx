"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/useQuotationStore";
import Home from "@/app/page";

interface QuotationEditorWrapperProps {
  quotation: {
    id: string;
    title: string;
    blocks: any;
    totalAmount: number;
  };
}

export default function QuotationEditorWrapper({
  quotation,
}: QuotationEditorWrapperProps) {
  const { setId, setTitle, setBlocks, calculateTotal } = useQuotationStore();

  useEffect(() => {
    setId(quotation.id);
    setTitle(quotation.title);
    setBlocks(quotation.blocks as any[]);
    calculateTotal();
  }, [quotation, setId, setTitle, setBlocks, calculateTotal]);

  return <Home />;
}
