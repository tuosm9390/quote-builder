import { create } from "zustand";

interface QuotationState {
  id: string | null;
  title: string;
  blocks: any[];
  totalAmount: number;
  setId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setBlocks: (blocks: any[]) => void;
  calculateTotal: () => void;
  reset: () => void;
}

export const useQuotationStore = create<QuotationState>((set, get) => ({
  id: null,
  title: "Untitled Quotation",
  blocks: [],
  totalAmount: 0,
  setId: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  setBlocks: (blocks) => {
    set({ blocks });
    get().calculateTotal();
  },
  calculateTotal: () => {
    const { blocks } = get();
    let total = 0;
    blocks.forEach((block) => {
      if (block.type === "pricingTable" && block.props?.rows) {
        const rows = block.props.rows as any[];
        rows.forEach((row) => {
          const qty = Number(row.quantity) || 0;
          const price = Number(row.unitPrice) || 0;
          total += qty * price;
        });
      }
    });
    set({ totalAmount: total });
  },
  reset: () =>
    set({
      id: null,
      title: "Untitled Quotation",
      blocks: [],
      totalAmount: 0,
    }),
}));
