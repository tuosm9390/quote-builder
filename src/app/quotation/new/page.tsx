"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/useQuotationStore";
import QuotationEditorContainer from "@/components/editor/QuotationEditorContainer";

export default function NewQuotationPage() {
  const { reset } = useQuotationStore();

  useEffect(() => {
    reset();
  }, [reset]);

  return <QuotationEditorContainer />;
}
