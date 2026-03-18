import { z } from "zod";

export const quotationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  blocks: z.array(z.any()), // BlockNote blocks
  totalAmount: z.number().min(0),
});

export type QuotationInput = z.infer<typeof quotationSchema>;
