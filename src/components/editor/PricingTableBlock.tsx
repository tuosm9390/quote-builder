"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { Table, TextInput, ActionIcon, Button, Text, Switch, Group, Stack, Divider, Box } from "@mantine/core";
import { Plus, Trash2, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { PricingTableRow, PricingTableColumn } from "@/types/quotation";

const PricingTable = ({ 
  block, 
  editor 
}: { 
  block: any; 
  editor: any; 
}) => {
  const [vendorName, setVendorName] = useState<string>(block.props?.vendorName || "");
  const [rows, setRows] = useState<PricingTableRow[]>(block.props?.rows || []);
  const [columns, setColumns] = useState<PricingTableColumn[]>(block.props?.columns || []);
  const [vatIncluded, setVatIncluded] = useState<boolean>(block.props?.vatIncluded || false);

  const isEditable = editor.isEditable;

  // Sync local state to block props when changed
  const updateBlock = (newVendor: string, newRows: PricingTableRow[], newCols: PricingTableColumn[], newVat: boolean) => {
    if (!block || !block.props || !isEditable) return;
    editor.updateBlock(block, {
      props: {
        ...block.props,
        vendorName: newVendor,
        rows: newRows,
        columns: newCols,
        vatIncluded: newVat,
      },
    });
  };

  const handleVendorChange = (val: string) => {
    setVendorName(val);
    updateBlock(val, rows, columns, vatIncluded);
  };

  const handleVatToggle = (checked: boolean) => {
    setVatIncluded(checked);
    updateBlock(vendorName, rows, columns, checked);
  };

  const addRow = () => {
    const newRow: PricingTableRow = {
      id: Date.now().toString(),
      item: "",
      spec: "",
      quantity: 0,
      unitPrice: 0,
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    updateBlock(vendorName, newRows, columns, vatIncluded);
  };

  const deleteRow = (id: string) => {
    const newRows = rows.filter((r) => r.id !== id);
    setRows(newRows);
    updateBlock(vendorName, newRows, columns, vatIncluded);
  };

  const updateRowValue = (
    rowId: string,
    colId: string,
    value: string | number,
  ) => {
    const newRows = rows.map((r) =>
      r.id === rowId ? { ...r, [colId]: value } : r,
    );
    setRows(newRows);
    updateBlock(vendorName, newRows, columns, vatIncluded);
  };

  const addColumn = () => {
    const newColId = `col_${Date.now()}`;
    const newCols: PricingTableColumn[] = [
      ...columns,
      { id: newColId, label: "새 열", type: "text" },
    ];
    setColumns(newCols);
    updateBlock(vendorName, rows, newCols, vatIncluded);
  };

  const removeColumn = (id: string) => {
    if (columns.length <= 1) return;
    const newCols = columns.filter((c) => c.id !== id);
    setColumns(newCols);
    updateBlock(vendorName, rows, newCols, vatIncluded);
  };

  const { supplyAmount, vatAmount, totalAmount } = useMemo(() => {
    const supply = rows.reduce((sum, row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.unitPrice) || 0;
      return sum + Math.floor(qty * price);
    }, 0);
    
    const vat = vatIncluded ? Math.floor(supply * 0.1) : 0;
    const total = supply + vat;
    
    return { supplyAmount: supply, vatAmount: vat, totalAmount: total };
  }, [rows, vatIncluded]);

  if (!block || !block.props) return null;

  return (
    <div className={`toss-card overflow-hidden border border-slate-900 my-8 transition-none ${!isEditable ? "pdf-no-border shadow-none" : ""}`}>
      {/* Header Info: Vendor Name */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white print:bg-black">
        <Group gap="sm">
          <Building2 size={18} />
          <TextInput
            variant="unstyled"
            placeholder="업체명 입력"
            value={vendorName}
            readOnly={!isEditable}
            onChange={(e) => handleVendorChange(e.target.value)}
            styles={{
              input: { 
                color: "white", 
                fontWeight: 800, 
                fontSize: "1.1rem",
                padding: 0,
                minHeight: "unset",
                height: "auto",
                width: "200px"
              }
            }}
          />
        </Group>
        {isEditable && (
          <Group gap="xs">
            <Switch 
              size="xs" 
              label="VAT 포함" 
              checked={vatIncluded} 
              onChange={(event) => handleVatToggle(event.currentTarget.checked)}
              styles={{ label: { color: "white", fontSize: "10px", fontWeight: 700 } }}
            />
            <Divider orientation="vertical" h={12} color="slate.7" />
            <Button
              variant="subtle"
              size="compact-xs"
              color="white"
              leftSection={<Plus size={14} />}
              onClick={addColumn}
              styles={{ label: { fontSize: "10px", fontWeight: 700 } }}
            >
              열 추가
            </Button>
          </Group>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table horizontalSpacing="md" verticalSpacing="sm" withRowBorders withColumnBorders>
          <Table.Thead className="bg-slate-50 border-b border-slate-900">
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.id} className="min-w-[100px] py-3">
                  <div className="flex items-center gap-1 group justify-center">
                    <TextInput
                      variant="unstyled"
                      size="xs"
                      value={col.label}
                      readOnly={!isEditable}
                      onChange={(e) => {
                        const newCols = columns.map((c) =>
                          c.id === col.id
                            ? { ...c, label: e.target.value }
                            : c,
                        );
                        setColumns(newCols);
                        updateBlock(vendorName, rows, newCols, vatIncluded);
                      }}
                      styles={{
                        input: { fontWeight: 900, color: "#1a1a1a", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px" },
                      }}
                    />
                    {isEditable && (
                      <ActionIcon
                        variant="transparent"
                        color="gray"
                        size="xs"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => removeColumn(col.id)}
                      >
                        <Trash2 size={12} />
                      </ActionIcon>
                    )}
                  </div>
                </Table.Th>
              ))}
              {isEditable && <Table.Th w={40}></Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                {columns.map((col) => (
                  <Table.Td key={`${row.id}-${col.id}`} p={0}>
                    {col.type === "calculated" ? (
                      <div className="text-sm font-extrabold text-right text-slate-900 pr-4 py-3">
                        {((Number(row.quantity) || 0) * (Number(row.unitPrice) || 0)).toLocaleString()}
                      </div>
                    ) : (
                      <TextInput
                        variant="unstyled"
                        size="sm"
                        value={row[col.id] ?? ""}
                        readOnly={!isEditable}
                        type={col.type === "number" ? "number" : "text"}
                        onChange={(e) =>
                          updateRowValue(row.id, col.id, e.target.value)
                        }
                        styles={{ 
                          input: { 
                            padding: "12px 16px",
                            textAlign: col.type === "number" ? "right" : "left",
                            fontWeight: col.type === "number" ? 600 : 500,
                            color: "#333"
                          } 
                        }}
                        placeholder={isEditable ? `${col.label}` : ""}
                        className={!isEditable ? "pdf-text-only" : ""}
                      />
                    )}
                  </Table.Td>
                ))}
                {isEditable && (
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => deleteRow(row.id)}
                    >
                      <Trash2 size={14} />
                    </ActionIcon>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <div className={`p-6 border-t-2 border-slate-900 flex flex-col md:flex-row justify-between items-end gap-6 ${!isEditable ? "pdf-no-border" : ""}`}>
        <div className="w-full md:w-auto">
          {isEditable && (
            <Button
              variant="outline"
              color="dark"
              size="sm"
              leftSection={<Plus size={16} />}
              onClick={addRow}
              className="rounded-xl border-slate-300 hover:border-slate-900 font-bold transition-all"
            >
              항목 추가
            </Button>
          )}
        </div>
        
        <Box className="w-full md:w-[320px]">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" fw={800} c="dimmed" className="uppercase tracking-widest">Supply Amount</Text>
              <Text size="sm" fw={700} c="slate.8">₩ {supplyAmount.toLocaleString()}</Text>
            </Group>
            {vatIncluded && (
              <Group justify="space-between">
                <Text size="xs" fw={800} c="dimmed" className="uppercase tracking-widest">VAT (10%)</Text>
                <Text size="sm" fw={700} c="slate.8">₩ {vatAmount.toLocaleString()}</Text>
              </Group>
            )}
            <div className="h-[1px] bg-slate-100 my-1" />
            <Group justify="space-between">
              <Text fw={900} size="sm" className="uppercase tracking-widest">Total</Text>
              <Text fw={900} size="xl" c="slate.9">₩ {totalAmount.toLocaleString()}</Text>
            </Group>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

// Define the basic structure for Pricing Table blocks
export const PricingTableBlock = createReactBlockSpec(
  {
    type: "pricingTable",
    propSchema: {
      vendorName: {
        default: "",
      },
      vatIncluded: {
        default: false,
      },
      columns: {
        default: [
          { id: "item", label: "품목", type: "text" },
          { id: "spec", label: "규격", type: "text" },
          { id: "quantity", label: "수량", type: "number" },
          { id: "unitPrice", label: "단가", type: "number" },
          { id: "amount", label: "금액", type: "calculated" },
        ] as PricingTableColumn[],
      },
      rows: {
        default: [
          { id: "1", item: "예시 항목 1", spec: "규격/사양", quantity: 1, unitPrice: 10000 },
        ] as PricingTableRow[],
      },
    },
    content: "none",
  } as any,
  {
    render: (props: any) => <PricingTable {...props} />,
  },
);
