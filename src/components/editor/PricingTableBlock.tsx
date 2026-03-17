\"use client\";

import { createReactBlockSpec } from \"@blocknote/react\";
import { Table, TextInput, ActionIcon, Button, Text } from \"@mantine/core\";
import { Plus, Trash2 } from \"lucide-react\";
import { useState, useMemo } from \"react\";
import { PricingTableRow, PricingTableColumn } from \"@/types/quotation\";

const PricingTable = ({ 
  block, 
  editor 
}: { 
  block: any; 
  editor: any; 
}) => {
  const [rows, setRows] = useState<PricingTableRow[]>(block.props.rows);
  const [columns, setColumns] = useState<PricingTableColumn[]>(block.props.columns);

  // Sync local state to block props when changed
  const updateBlock = (newRows: PricingTableRow[], newCols: PricingTableColumn[]) => {
    editor.updateBlock(block, {
      props: {
        ...block.props,
        rows: newRows,
        columns: newCols,
      },
    });
  };

  const addRow = () => {
    const newRow: PricingTableRow = {
      id: Date.now().toString(),
      item: \"\",
      quantity: 0,
      unitPrice: 0,
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    updateBlock(newRows, columns);
  };

  const deleteRow = (id: string) => {
    const newRows = rows.filter((r) => r.id !== id);
    setRows(newRows);
    updateBlock(newRows, columns);
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
    updateBlock(newRows, columns);
  };

  const addColumn = () => {
    const newColId = `col_${Date.now()}`;
    const newCols: PricingTableColumn[] = [
      ...columns,
      { id: newColId, label: \"새 열\", type: \"text\" },
    ];
    setColumns(newCols);
    updateBlock(rows, newCols);
  };

  const removeColumn = (id: string) => {
    if (columns.length <= 1) return;
    const newCols = columns.filter((c) => c.id !== id);
    setColumns(newCols);
    updateBlock(rows, newCols);
  };

  const totalAmount = useMemo(() => {
    return rows.reduce((sum, row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [rows]);

  return (
    <div className=\"toss-card overflow-hidden border border-slate-100 my-4\">
      <div className=\"p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center\">
        <Text fw={700} size=\"sm\" c=\"dimmed\">
          가격 산정 테이블
        </Text>
        <Button
          variant=\"subtle\"
          size=\"compact-xs\"
          leftSection={<Plus size={14} />}
          onClick={addColumn}
        >
          열 추가
        </Button>
      </div>
      <div className=\"overflow-x-auto\">
        <Table horizontalSpacing=\"md\" verticalSpacing=\"sm\">
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.id} className=\"min-w-[120px]\">
                  <div className=\"flex items-center gap-1 group\">
                    <TextInput
                      variant=\"unstyled\"
                      size=\"xs\"
                      value={col.label}
                      onChange={(e) => {
                        const newCols = columns.map((c) =>
                          c.id === col.id
                            ? { ...c, label: e.target.value }
                            : c,
                        );
                        setColumns(newCols);
                        updateBlock(rows, newCols);
                      }}
                      styles={{
                        input: { fontWeight: 600, color: \"#4b5563\" },
                      }}
                    />
                    <ActionIcon
                      variant=\"transparent\"
                      color=\"gray\"
                      size=\"xs\"
                      className=\"opacity-0 group-hover:opacity-100\"
                      onClick={() => removeColumn(col.id)}
                    >
                      <Trash2 size={12} />
                    </ActionIcon>
                  </div>
                </Table.Th>
              ))}
              <Table.Th w={40}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id}>
                {columns.map((col) => (
                  <Table.Td key={`${row.id}-${col.id}`}>
                    {col.type === \"calculated\" ? (
                      <div className=\"text-sm font-medium text-right text-slate-900 pr-2\">
                        {(
                          (Number(row.quantity) || 0) *
                          (Number(row.unitPrice) || 0)
                        ).toLocaleString()}
                      </div>
                    ) : (
                      <TextInput
                        variant=\"unstyled\"
                        size=\"sm\"
                        value={row[col.id] ?? \"\"}
                        type={col.type === \"number\" ? \"number\" : \"text\"}
                        onChange={(e) =>
                          updateRowValue(row.id, col.id, e.target.value)
                        }
                        styles={{ input: { padding: \"4px 8px\" } }}
                        placeholder={`${col.label} 입력`}
                      />
                    )}
                  </Table.Td>
                ))}
                <Table.Td>
                  <ActionIcon
                    variant=\"subtle\"
                    color=\"red\"
                    size=\"sm\"
                    onClick={() => deleteRow(row.id)}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <div className=\"p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-4\">
        <Button
          variant=\"light\"
          color=\"primary\"
          fullWidth
          size=\"sm\"
          leftSection={<Plus size={16} />}
          onClick={addRow}
          className=\"rounded-xl\"
        >
          행 추가하기
        </Button>
        <div className=\"flex justify-between items-center px-4\">
          <Text fw={600} size=\"lg\" c=\"slate.9\">
            합계
          </Text>
          <Text fw={800} size=\"xl\" c=\"primary\">
            ₩ {totalAmount.toLocaleString()}
          </Text>
        </div>
      </div>
    </div>
  );
};

// Define the basic structure for Pricing Table blocks
export const PricingTableBlock = createReactBlockSpec(
  {
    type: \"pricingTable\",
    propSchema: {
      columns: {
        default: [
          { id: \"item\", label: \"품목\", type: \"text\" },
          { id: \"quantity\", label: \"수량\", type: \"number\" },
          { id: \"unitPrice\", label: \"단가\", type: \"number\" },
          { id: \"amount\", label: \"금액\", type: \"calculated\" },
        ] as PricingTableColumn[],
      },
      rows: {
        default: [
          { id: \"1\", item: \"예시 항목 1\", quantity: 1, unitPrice: 10000 },
          { id: \"2\", item: \"예시 항목 2\", quantity: 2, unitPrice: 5000 },
        ] as PricingTableRow[],
      },
    },
    content: \"none\",
  },
  {
    render: (props) => <PricingTable {...props} />,
  },
);
