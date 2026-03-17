"use server";

import { prisma } from "@/lib/prisma";
import { quotationSchema } from "@/lib/validations/quotation";
import { revalidatePath } from "next/cache";

export async function saveQuotation(
  id: string | null,
  data: { title: string; blocks: any[] }
) {
  // Server-side recalculation of totalAmount
  let serverTotal = 0;
  data.blocks.forEach((block: any) => {
    if (block.type === "pricingTable" && block.props?.rows) {
      const rows = block.props.rows as any[];
      rows.forEach((row) => {
        const qty = Number(row.quantity) || 0;
        const price = Number(row.unitPrice) || 0;
        serverTotal += qty * price;
      });
    }
  });

  const validated = quotationSchema.parse({
    ...data,
    totalAmount: serverTotal,
  });

  if (id) {
    const updated = await prisma.quotation.update({
      where: { id },
      data: {
        title: validated.title,
        blocks: validated.blocks as any,
        totalAmount: validated.totalAmount,
      },
    });
    revalidatePath(`/quotation/${id}`);
    revalidatePath("/");
    return updated;
  } else {
    const created = await prisma.quotation.create({
      data: {
        title: validated.title,
        blocks: validated.blocks as any,
        totalAmount: validated.totalAmount,
      },
    });
    revalidatePath("/");
    return created;
  }
}
