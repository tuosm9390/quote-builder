import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuotationEditorWrapper from "./QuotationEditorWrapper";

export default async function QuotationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const quotation = await prisma.quotation.findUnique({
    where: { id },
  });

  if (!quotation) {
    notFound();
  }

  return <QuotationEditorWrapper quotation={quotation} />;
}
