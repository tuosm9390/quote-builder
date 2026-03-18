export interface PricingTableRow {
  id: string;
  item: string;
  spec?: string;
  quantity: number;
  unitPrice: number;
  [key: string]: string | number | undefined;
}

export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";

export interface Quotation {
  id: string;
  title: string;
  description?: string | null;
  blocks: any;
  totalAmount: number;
  status: QuotationStatus | string;
  ownerId?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingTableColumn {
  id: string;
  label: string;
  type: "text" | "number" | "calculated" | "percentage";
  width?: number; // percentage width (0-100)
  percentageMode?: "ratio" | "discount" | "margin" | "markup";
  formula?: {
    leftColId: string;
    rightColId: string;
    operator: "+" | "-" | "*" | "/";
  };
}

export interface PricingTableProps {
  columns: PricingTableColumn[];
  rows: PricingTableRow[];
  vatIncluded: boolean;
  totalColId?: string;
  vendorName?: string;
}

export interface QuotationHeader {
  logo?: string;
  title: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  from: {
    name: string;
    address: string;
    contact: string;
    email: string;
    registrationNumber: string;
  };
  to: {
    name: string;
    contact: string;
    email: string;
  };
}

export interface QuotationFooter {
  notes: string;
  terms: string;
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
  content: any[];
  children: Block[];
}

export interface PricingTableBlock extends Block {
  type: "pricingTable";
  props: PricingTableProps;
}
