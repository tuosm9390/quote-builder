export interface PricingTableRow {
  id: string;
  item: string;
  quantity: number;
  unitPrice: number;
  [key: string]: string | number;
}

export interface PricingTableColumn {
  id: string;
  label: string;
  type: \"text\" | \"number\" | \"calculated\";
}

export interface PricingTableProps {
  columns: PricingTableColumn[];
  rows: PricingTableRow[];
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
  content: any[];
  children: Block[];
}

export interface PricingTableBlock extends Block {
  type: \"pricingTable\";
  props: PricingTableProps;
}
