"use server";

import { prisma } from "@/lib/prisma";
import { quotationSchema } from "@/lib/validations/quotation";
import { validateQuotationTotal } from "@/lib/calculations";
import { revalidatePath } from "next/cache";
import { Quotation } from "@prisma/client";
import { Block } from "@/types/quotation";

export async function saveQuotation(
  id: string | null,
  data: { title: string; blocks: Block[] }
): Promise<Quotation> {
  // Recalculate totalAmount on server-side using the shared calculation engine (FR-004)
  const serverTotal = validateQuotationTotal(data.blocks);

  const validated = quotationSchema.parse({
    ...data,
    totalAmount: serverTotal,
  });

  if (id) {
    // Ensure we don't update a quotation that is not DRAFT (FR-006)
    const existing = await prisma.quotation.findUnique({ where: { id } });
    if (existing?.status !== "DRAFT") {
      throw new Error("Only DRAFT quotations can be modified.");
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: {
        title: validated.title,
        blocks: validated.blocks as any, // Cast to any for Prisma Json compatibility
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
        blocks: validated.blocks as any, // Cast to any for Prisma Json compatibility
        totalAmount: validated.totalAmount,
        status: "DRAFT",
      },
    });
    revalidatePath("/");
    return created;
  }
}

/**
 * Fetches all quotations that are not soft-deleted (FR-008).
 * Ordered by createdAt descending.
 */
export async function getQuotations(): Promise<Quotation[]> {
  try {
    const quotations = await prisma.quotation.findMany({
      where: { deletedAt: null } as any,
      orderBy: {
        createdAt: "desc",
      },
    });
    return quotations;
  } catch (error) {
    console.error("Failed to fetch quotations:", error);
    throw new Error("Failed to fetch quotations.");
  }
}

/**
 * Manually updates the status of a quotation (FR-006).
 */
export async function updateStatus(id: string, status: string): Promise<Quotation> {
  const updated = await prisma.quotation.update({
    where: { id },
    data: { status },
  });
  revalidatePath(`/quotation/${id}`);
  revalidatePath("/");
  return updated;
}

/**
 * Performs a Soft Delete by setting deletedAt (FR-008).
 */
export async function softDeleteQuotation(id: string): Promise<Quotation> {
  const updated = await prisma.quotation.update({
    where: { id },
    data: { deletedAt: new Date() } as any,
  });
  revalidatePath("/");
  return updated;
}
