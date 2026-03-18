import { PricingTableRow, PricingTableColumn, Block } from "@/types/quotation";

/**
 * Recursively calculates a cell's value based on formulas and percentage modes.
 * Includes protection against circular dependencies.
 */
export const getCellValue = (
  row: PricingTableRow, 
  colId: string, 
  columns: PricingTableColumn[], 
  visited = new Set<string>()
): number => {
  const col = columns.find(c => c.id === colId);
  if (!col) return 0;
  
  if (visited.has(colId)) return 0;
  
  if (col.type === "calculated" && col.formula) {
    visited.add(colId);
    const leftRaw = getCellValue(row, col.formula.leftColId, columns, new Set(visited));
    const rightRaw = getCellValue(row, col.formula.rightColId, columns, new Set(visited));
    
    const leftCol = columns.find(c => c.id === col.formula?.leftColId);
    const rightCol = columns.find(c => c.id === col.formula?.rightColId);
    
    const transformValue = (val: number, c?: PricingTableColumn) => {
      // @ts-ignore - formula operator is guaranteed if type is calculated
      if (c?.type === "percentage" && col.formula?.operator === "*") {
        const mode = c.percentageMode || "ratio";
        const r = val / 100;
        if (mode === "discount") return (1 - r);
        if (mode === "margin" || mode === "markup") return (1 + r);
        return r;
      }
      return val;
    };

    const leftVal = transformValue(leftRaw, leftCol);
    const rightVal = transformValue(rightRaw, rightCol);

    let result = 0;
    switch (col.formula.operator) {
      case "+": result = leftVal + rightVal; break;
      case "-": result = leftVal - rightVal; break;
      case "*": result = leftVal * rightVal; break;
      case "/": result = rightVal !== 0 ? leftVal / rightVal : 0; break;
    }
    return Math.floor(result);
  }
  
  return Number(row[colId]) || 0;
};

/**
 * Calculates the total for a pricing table block using A4 dynamic logic.
 */
export const calculateBlockTotal = (blockProps: any): number => {
  const { rows = [], columns = [], totalColId, vatIncluded = false } = blockProps;
  
  if (columns.length === 0) return 0;

  // Identify the target column for final sum
  const targetColId = totalColId || 
                     [...columns].reverse().find(c => c.type === "calculated")?.id || 
                     columns[columns.length - 1].id;

  const supplyAmount = rows.reduce((sum: number, row: PricingTableRow) => {
    return sum + getCellValue(row, targetColId, columns);
  }, 0);

  const vatAmount = vatIncluded ? Math.floor(supplyAmount * 0.1) : 0;
  
  return supplyAmount + vatAmount;
};

/**
 * Iterates through all blocks and returns the total quotation amount.
 */
export const validateQuotationTotal = (blocks: Block[]): number => {
  return blocks.reduce((total, block) => {
    if (block.type === "pricingTable" && block.props) {
      return total + calculateBlockTotal(block.props);
    }
    return total;
  }, 0);
};
