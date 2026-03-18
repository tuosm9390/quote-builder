import { create } from "zustand";
import { validateQuotationTotal } from "@/lib/calculations";
import { PricingTableProps, QuotationHeader, QuotationFooter, Block } from "@/types/quotation";

interface QuotationState {
  id: string | null;
  title: string;
  blocks: Block[]; // Keeps backward compatibility with DB
  totalAmount: number;
  status: string; // DRAFT, SENT, ACCEPTED, REJECTED
  
  // Structured helpers for A4 Layout
  header: QuotationHeader;
  table: PricingTableProps;
  footer: QuotationFooter;

  setId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setBlocks: (blocks: Block[]) => void;
  setStatus: (status: string) => void;
  
  // A4 specific setters
  setHeader: (header: QuotationHeader) => void;
  setTable: (table: PricingTableProps) => void;
  setFooter: (footer: QuotationFooter) => void;
  
  syncToBlocks: () => void;
  calculateTotal: () => void;
  reset: () => void;
  isEditable: () => boolean;
}

const DEFAULT_HEADER: QuotationHeader = {
  title: "견 적 서",
  quotationNumber: "",
  date: new Date().toISOString().split('T')[0],
  validUntil: "",
  from: {
    name: "",
    address: "",
    contact: "",
    email: "",
    registrationNumber: "",
  },
  to: {
    name: "",
    contact: "",
    email: "",
  }
};

const DEFAULT_TABLE: PricingTableProps = {
  vatIncluded: true,
  totalColId: "amount",
  columns: [
    { id: "item", label: "품목", type: "text" },
    { id: "spec", label: "규격", type: "text" },
    { id: "quantity", label: "수량", type: "number" },
    { id: "unitPrice", label: "단가", type: "number" },
    { id: "amount", label: "금액", type: "calculated", formula: { leftColId: "quantity", rightColId: "unitPrice", operator: "*" } },
  ],
  rows: [
    { id: "1", item: "", spec: "", quantity: 0, unitPrice: 0 },
  ]
};

const DEFAULT_FOOTER: QuotationFooter = {
  notes: "",
  terms: "1. 본 견적서는 발행일로부터 30일간 유효합니다.\n2. 입금계좌: [계좌번호 입력]",
};

export const useQuotationStore = create<QuotationState>((set, get) => ({
  id: null,
  title: "Untitled Quotation",
  blocks: [],
  totalAmount: 0,
  status: "DRAFT",
  header: DEFAULT_HEADER,
  table: DEFAULT_TABLE,
  footer: DEFAULT_FOOTER,

  setId: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  
  // Sync structured data to blocks for DB saving
  syncToBlocks: () => {
    const { header, table, footer } = get();
    const blocks = [
      { id: "header-1", type: "a4Header", props: header },
      { id: "table-1", type: "pricingTable", props: table },
      { id: "footer-1", type: "a4Footer", props: footer },
    ];
    set({ blocks });
    get().calculateTotal();
  },

  setBlocks: (blocks) => {
    // If we load from DB, parse A4 sections if they exist
    const headerBlock = blocks.find(b => b.type === "a4Header");
    const tableBlock = blocks.find(b => b.type === "pricingTable");
    const footerBlock = blocks.find(b => b.type === "a4Footer");

    set({ 
      blocks,
      header: headerBlock ? (headerBlock.props as unknown as QuotationHeader) : DEFAULT_HEADER,
      table: tableBlock ? (tableBlock.props as unknown as PricingTableProps) : DEFAULT_TABLE,
      footer: footerBlock ? (footerBlock.props as unknown as QuotationFooter) : DEFAULT_FOOTER,
    });
    get().calculateTotal();
  },

  setHeader: (header) => {
    set({ header });
    get().syncToBlocks();
  },
  
  setTable: (table) => {
    set({ table });
    get().syncToBlocks();
  },
  
  setFooter: (footer) => {
    set({ footer });
    get().syncToBlocks();
  },

  setStatus: (status) => set({ status }),
  
  calculateTotal: () => {
    const { blocks } = get();
    const total = validateQuotationTotal(blocks);
    set({ totalAmount: total });
  },

  isEditable: () => {
    const { status } = get();
    return status === "DRAFT";
  },

  reset: () =>
    set({
      id: null,
      title: "Untitled Quotation",
      blocks: [],
      totalAmount: 0,
      status: "DRAFT",
      header: DEFAULT_HEADER,
      table: DEFAULT_TABLE,
      footer: DEFAULT_FOOTER,
    }),
}));
