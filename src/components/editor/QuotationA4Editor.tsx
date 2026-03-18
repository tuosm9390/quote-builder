"use client";

import { useQuotationStore } from "@/store/useQuotationStore";
import { PricingTableRow, PricingTableColumn } from "@/types/quotation";
import { getCellValue } from "@/lib/calculations";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Calculator,
  Percent,
  Type,
  Hash,
  Coins,
  TrendingDown,
  TrendingUp,
  CircleDot,
  MoveHorizontal,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- 1. Specialized Memoized Components for Maximum Speed ---

const MemoizedRow = memo(
  ({
    row,
    index,
    columns,
    editable,
    updateRowValue,
    deleteRow,
    getCellValue,
    formatNum,
  }: any) => {
    return (
      <tr className="border-b border-slate-200 group hover:bg-slate-50/50 transition-colors">
        <td className="text-center py-3 text-xs font-medium text-slate-400 bg-slate-50/30">
          {index + 1}
        </td>
        {columns.map((col: any) => (
          <td
            key={col.id}
            className="py-2 px-2 border-l border-slate-100 first:border-l-0 overflow-hidden"
          >
            {col.type === "calculated" ? (
              <div className="text-right text-xs font-black text-slate-900 pr-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {getCellValue(row, col.id, columns).toLocaleString()}
              </div>
            ) : (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={
                    col.type === "number" ||
                    col.type === "percentage" ||
                    col.label === "수량"
                      ? formatNum(row[col.id])
                      : (row[col.id] ?? "")
                  }
                  onChange={(e) =>
                    updateRowValue(row.id, col.id, e.target.value)
                  }
                  className={cn(
                    "w-full border-none focus:ring-0 p-0 text-xs bg-transparent focus:bg-white transition-all",
                    col.type === "number" ||
                      col.type === "percentage" ||
                      col.label === "수량"
                      ? "text-right font-black text-slate-900 pr-2"
                      : "text-left",
                  )}
                  placeholder="-"
                  readOnly={!editable}
                />
                {col.type === "percentage" && (
                  <span className="text-[10px] font-black text-slate-400 absolute right-0.5">
                    %
                  </span>
                )}
              </div>
            )}
          </td>
        ))}
        {editable && (
          <td className="w-12 text-center no-print border-l border-slate-100">
            <button
              onClick={() => deleteRow(row.id)}
              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        )}
      </tr>
    );
  },
);
MemoizedRow.displayName = "MemoizedRow";

// --- 2. Modals with Portals & Simple CSS (No Blur for speed) ---

const AddColumnModal = memo(({ isOpen, onClose, onAdd }: any) => {
  const [localCol, setLocalCol] = useState({ label: "", type: "text" });
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 transition-opacity">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl border-2 border-slate-900 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black tracking-tight">새 열 추가</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              열 제목
            </label>
            <input
              autoFocus
              value={localCol.label}
              onChange={(e) =>
                setLocalCol({ ...localCol, label: e.target.value })
              }
              placeholder="예: 할인율..."
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-900 outline-none font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              데이터 타입
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["text", "number", "percentage", "calculated"] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setLocalCol({ ...localCol, type } as any)}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black border-2",
                      localCol.type === type
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200",
                    )}
                  >
                    {type === "text" && "텍스트"} {type === "number" && "숫자"}{" "}
                    {type === "percentage" && "백분율"}{" "}
                    {type === "calculated" && "금액(계산)"}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 font-black border-2"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                onAdd(localCol);
                setLocalCol({ label: "", type: "text" });
              }}
              className="flex-1 rounded-xl h-12 font-black bg-slate-900 text-white shadow-lg"
            >
              추가하기
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
});
AddColumnModal.displayName = "AddColumnModal";

const FormulaModal = memo(
  ({ isOpen, onClose, table, onUpdateFormula, onUpdateTotalCol }: any) => {
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-8 w-[550px] shadow-2xl border-2 border-slate-900 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-100">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-xl font-black tracking-tight">
              계산식 및 합계 설정
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="font-black text-lg">최종 합계 대상 열</span>
              </div>
              <select
                value={table.totalColId || ""}
                onChange={(e) => onUpdateTotalCol(e.target.value)}
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl font-black outline-none focus:border-yellow-400 text-sm"
              >
                {table.columns.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">
                개별 계산식 설정
              </h4>
              {table.columns
                .filter((c: any) => c.type === "calculated")
                .map((calcCol: any) => (
                  <div
                    key={calcCol.id}
                    className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4"
                  >
                    <div className="font-black text-slate-900">
                      [{calcCol.label}] 열 계산
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={calcCol.formula?.leftColId || ""}
                        onChange={(e) =>
                          onUpdateFormula(
                            calcCol.id,
                            e.target.value,
                            calcCol.formula?.rightColId,
                            calcCol.formula?.operator,
                          )
                        }
                        className="flex-1 p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm"
                      >
                        {table.columns
                          .filter((c: any) => c.id !== calcCol.id)
                          .map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                      </select>
                      <select
                        value={calcCol.formula?.operator || "*"}
                        onChange={(e) =>
                          onUpdateFormula(
                            calcCol.id,
                            calcCol.formula?.leftColId,
                            calcCol.formula?.rightColId,
                            e.target.value,
                          )
                        }
                        className="w-14 p-3 bg-slate-900 text-white rounded-xl font-black text-center"
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">×</option>
                        <option value="/">÷</option>
                      </select>
                      <select
                        value={calcCol.formula?.rightColId || ""}
                        onChange={(e) =>
                          onUpdateFormula(
                            calcCol.id,
                            calcCol.formula?.leftColId,
                            e.target.value,
                            calcCol.formula?.operator,
                          )
                        }
                        className="flex-1 p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm"
                      >
                        {table.columns
                          .filter((c: any) => c.id !== calcCol.id)
                          .map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="pt-6 shrink-0 border-t mt-4">
            <Button
              onClick={onClose}
              className="w-full rounded-xl h-12 font-black bg-slate-900 text-white shadow-lg"
            >
              설정 완료
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);
FormulaModal.displayName = "FormulaModal";

// --- 3. Main Optimized Component ---

export default function QuotationA4Editor() {
  const { header, table, footer, setHeader, setTable, setFooter, isEditable } =
    useQuotationStore();
  const editable = isEditable();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [activeColIdx, setActiveColIdx] = useState<number | null>(null);

  const closeSettings = useCallback(() => setActiveColIdx(null), []);
  useEffect(() => {
    if (activeColIdx !== null) {
      window.addEventListener("click", closeSettings);
      return () => window.removeEventListener("click", closeSettings);
    }
  }, [activeColIdx, closeSettings]);

  // Helpers
  const formatNum = useCallback((val: any) => {
    if (!val && val !== 0) return "";
    const num = Number(val);
    return isNaN(num) ? val : num.toLocaleString();
  }, []);

  const updateHeader = useCallback(
    (key: string, value: any, subkey?: string) => {
      if (!editable) return;
      if (subkey)
        setHeader({
          ...header,
          [key]: { ...(header as any)[key], [subkey]: value },
        });
      else setHeader({ ...header, [key]: value });
    },
    [editable, header, setHeader],
  );

  const addRow = useCallback(() => {
    if (!editable) return;
    const newRow = {
      id: Date.now().toString(),
      item: "",
      spec: "",
      quantity: 0,
      unitPrice: 0,
    };
    setTable({ ...table, rows: [...table.rows, newRow] });
  }, [editable, table, setTable]);

  const deleteRow = useCallback(
    (id: string) => {
      if (!editable) return;
      setTable({ ...table, rows: table.rows.filter((r) => r.id !== id) });
    },
    [editable, table, setTable],
  );

  const updateRowValue = useCallback(
    (rowId: string, colId: string, value: any) => {
      if (!editable) return;
      const cleanValue =
        typeof value === "string"
          ? value.replace(/,/g, "").replace(/%/g, "")
          : value;
      const newRows = table.rows.map((r) =>
        r.id === rowId ? { ...r, [colId]: cleanValue } : r,
      );
      setTable({ ...table, rows: newRows });
    },
    [editable, table, setTable],
  );

  const updateColumnWidth = useCallback(
    (colId: string, width: number) => {
      const newCols = table.columns.map((c) =>
        c.id === colId ? { ...c, width: Math.max(5, Math.min(80, width)) } : c,
      );
      setTable({ ...table, columns: newCols });
    },
    [table, setTable],
  );

  const updateColumnType = useCallback(
    (colId: string, newType: any) => {
      const newCols: PricingTableColumn[] = table.columns.map((c) => {
        if (c.id === colId) {
          const formula =
            newType === "calculated"
              ? {
                  leftColId: "quantity",
                  rightColId: "unitPrice",
                  operator: "*" as const,
                }
              : undefined;
          return {
            ...c,
            type: newType,
            formula,
            percentageMode:
              newType === "percentage" ? ("ratio" as const) : undefined,
          };
        }
        return c;
      });
      setTable({ ...table, columns: newCols });
    },
    [table, setTable],
  );

  const updateFormula = useCallback(
    (colId: string, left: string, right: string, op: any) => {
      const newCols = table.columns.map((c) =>
        c.id === colId
          ? {
              ...c,
              formula: { leftColId: left, rightColId: right, operator: op },
            }
          : c,
      );
      setTable({ ...table, columns: newCols });
    },
    [table, setTable],
  );

  const updatePercentageMode = useCallback(
    (colId: string, mode: "ratio" | "discount" | "margin") => {
      const newCols = table.columns.map((c) =>
        c.id === colId ? { ...c, percentageMode: mode } : c,
      );
      setTable({ ...table, columns: newCols });
    },
    [table, setTable],
  );

  const moveColumn = useCallback(
    (idx: number, direction: "left" | "right") => {
      if (!editable) return;
      const newCols = [...table.columns];
      const targetIdx = direction === "left" ? idx - 1 : idx + 1;

      if (targetIdx < 0 || targetIdx >= newCols.length) return;

      // Swap columns
      [newCols[idx], newCols[targetIdx]] = [newCols[targetIdx], newCols[idx]];

      setTable({ ...table, columns: newCols });
      setActiveColIdx(targetIdx); // Follow the selected column
    },
    [editable, table, setTable],
  );

  const deleteColumn = useCallback(
    (colId: string) => {
      if (!editable) return;
      const newCols = table.columns.filter((c) => c.id !== colId);
      setTable({ ...table, columns: newCols });
      setActiveColIdx(null); // Close toolbar
    },
    [editable, table, setTable],
  );

  const updateColumnLabel = useCallback(
    (colId: string, label: string) => {
      if (!editable) return;
      const newCols = table.columns.map((c) =>
        c.id === colId ? { ...c, label } : c,
      );
      setTable({ ...table, columns: newCols });
    },
    [editable, table, setTable],
  );

  const handleAddColumn = useCallback(
    (colData: any) => {
      const colId = `col_${Date.now()}`;
      const formula =
        colData.type === "calculated"
          ? {
              leftColId: "quantity",
              rightColId: "unitPrice",
              operator: "*" as const,
            }
          : undefined;
      const updatedCols = [
        ...table.columns,
        {
          id: colId,
          label: colData.label,
          type: colData.type,
          formula,
          width: 15,
          percentageMode:
            colData.type === "percentage" ? ("ratio" as const) : undefined,
        },
      ];
      setTable({ ...table, columns: updatedCols });
      setIsModalOpen(false);
    },
    [table, setTable],
  );

  // Final Calculations
  const { supplyAmount, vatAmount, totalAmount } = useMemo(() => {
    const totalTargetId =
      table.totalColId ||
      table.columns.find((c) => c.type === "calculated")?.id ||
      table.columns[table.columns.length - 1].id;
    const supply = table.rows.reduce(
      (sum, row) => sum + getCellValue(row, totalTargetId, table.columns),
      0,
    );
    const vat = table.vatIncluded ? Math.floor(supply * 0.1) : 0;
    return { supplyAmount: supply, vatAmount: vat, totalAmount: supply + vat };
  }, [table.rows, table.columns, table.vatIncluded, table.totalColId]);

  // --- 4. The "Canvas" is memoized to avoid re-rendering when modals toggle ---
  const a4Canvas = useMemo(
    () => (
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] p-[20mm] flex flex-col font-sans text-slate-900 relative print:shadow-none print:p-0">
        <div className="mb-12 pdf-section">
          <input
            value={header.title}
            onChange={(e) => updateHeader("title", e.target.value)}
            className="w-full text-center text-5xl font-black tracking-[0.2em] border-none focus:ring-0 mb-12 uppercase bg-transparent"
            placeholder="견 적 서"
            readOnly={!editable}
          />
          <div className="flex justify-between items-start gap-12">
            <div className="flex-1 space-y-4">
              <div className="border-b-2 border-slate-900 pb-2 flex items-baseline gap-2">
                <input
                  value={header.to.name}
                  onChange={(e) => updateHeader("to", e.target.value, "name")}
                  className="text-2xl font-bold border-none focus:ring-0 p-0 w-[200px] bg-transparent"
                  placeholder="귀하/귀중"
                  readOnly={!editable}
                />
                <span className="text-lg font-bold text-slate-400">귀하</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex">
                  <span className="w-20 text-slate-400 font-bold">참조</span>
                  <input
                    value={header.to.contact}
                    onChange={(e) =>
                      updateHeader("to", e.target.value, "contact")
                    }
                    className="flex-1 border-none focus:ring-0 p-0 h-auto bg-transparent"
                    placeholder="담당자명/연락처"
                    readOnly={!editable}
                  />
                </div>
                <div className="flex">
                  <span className="w-20 text-slate-400 font-bold">이메일</span>
                  <input
                    value={header.to.email}
                    onChange={(e) =>
                      updateHeader("to", e.target.value, "email")
                    }
                    className="flex-1 border-none focus:ring-0 p-0 h-auto bg-transparent"
                    placeholder="example@email.com"
                    readOnly={!editable}
                  />
                </div>
              </div>
            </div>
            <div className="w-[320px] border border-slate-900">
              <div className="flex border-b border-slate-900">
                <div className="w-8 bg-slate-900 text-white flex items-center justify-center text-[10px] [writing-mode:vertical-lr] py-2 font-bold uppercase tracking-widest">
                  Vendor
                </div>
                <div className="flex-1">
                  {[
                    { label: "등록번호", key: "registrationNumber" },
                    { label: "상호(성명)", key: "name" },
                    { label: "주소", key: "address", small: true },
                    { label: "연락처", key: "contact" },
                  ].map((item, idx, arr) => (
                    <div
                      key={item.key}
                      className={cn(
                        "flex",
                        idx !== arr.length - 1 && "border-b border-slate-900",
                      )}
                    >
                      <div className="w-20 bg-slate-50 border-r border-slate-900 px-2 py-1.5 text-[11px] font-bold flex items-center justify-center">
                        {item.label}
                      </div>
                      <div className="flex-1 px-2 py-1.5">
                        <input
                          value={(header.from as any)[item.key]}
                          onChange={(e) =>
                            updateHeader("from", e.target.value, item.key)
                          }
                          className={cn(
                            "w-full border-none focus:ring-0 p-0 bg-transparent",
                            item.small ? "text-[10px]" : "text-xs font-bold",
                          )}
                          readOnly={!editable}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 border-y-4 border-slate-900 py-3 flex justify-between items-center px-4 bg-slate-50 pdf-section">
          <span className="font-bold text-slate-600 uppercase tracking-tighter">
            Total Amount
          </span>
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-bold text-slate-400">
              일금 {totalAmount.toLocaleString()}원정
            </span>
            <span className="text-2xl font-black italic tracking-tight">
              ₩ {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[400px] pdf-section overflow-visible">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-900 text-white border-y border-slate-900">
                <th className="w-12 py-2 text-[11px] font-bold">NO</th>
                {table.columns.map((col, idx) => (
                  <th
                    key={col.id}
                    onClick={(e) => {
                      if (!editable) return;
                      e.stopPropagation();
                      setActiveColIdx(activeColIdx === idx ? null : idx);
                    }}
                    style={{ width: col.width ? `${col.width}%` : "auto" }}
                    className={cn(
                      "py-2 px-2 text-[11px] font-bold relative border-l border-white/10 first:border-l-0 cursor-pointer transition-colors",
                      activeColIdx === idx
                        ? "bg-slate-800"
                        : "hover:bg-slate-800/50",
                    )}
                  >
                    <input
                      value={col.label}
                      onChange={(e) =>
                        updateColumnLabel(col.id, e.target.value)
                      }
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-center text-white font-black uppercase tracking-tighter cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                      readOnly={!editable}
                      onClick={(e) => {
                        if (!editable) return;
                        e.stopPropagation();
                        if (activeColIdx !== idx) setActiveColIdx(idx);
                      }}
                    />
                    {editable && activeColIdx === idx && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 bg-white p-3 rounded-2xl shadow-2xl no-print z-[100] border-2 border-slate-900 w-[280px]"
                      >
                        <div className="w-full space-y-1.5 px-1">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                              <MoveHorizontal className="w-3 h-3" /> Width
                            </div>
                            <span>{col.width || 15}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="80"
                            value={col.width || 15}
                            onChange={(e) =>
                              updateColumnWidth(
                                col.id,
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                          />
                        </div>
                        <div className="flex w-full gap-1 p-1 bg-slate-100 rounded-xl">
                          {[
                            { id: "text", icon: Type, label: "텍스트" },
                            { id: "number", icon: Hash, label: "숫자" },
                            {
                              id: "percentage",
                              icon: Percent,
                              label: "백분율",
                            },
                            {
                              id: "calculated",
                              icon: Calculator,
                              label: "계산",
                            },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() =>
                                updateColumnType(col.id, t.id as any)
                              }
                              className={cn(
                                "flex-1 flex flex-col items-center justify-center p-1.5 rounded-lg transition-all",
                                col.type === t.id
                                  ? "bg-slate-900 text-white shadow-md"
                                  : "text-slate-400 hover:bg-slate-200",
                              )}
                            >
                              <t.icon className="w-3.5 h-3.5" />
                              <span className="text-[8px] font-bold mt-0.5">
                                {t.label}
                              </span>
                            </button>
                          ))}
                        </div>

                        {col.type === "percentage" && (
                          <div className="flex w-full gap-1 p-1 bg-blue-50/50 border border-blue-100 rounded-xl">
                            {[
                              { id: "ratio", label: "비율" },
                              { id: "discount", label: "할인" },
                              { id: "margin", label: "마진" },
                            ].map((m) => (
                              <button
                                key={m.id}
                                onClick={() =>
                                  updatePercentageMode(col.id, m.id as any)
                                }
                                className={cn(
                                  "flex-1 py-1 rounded-lg text-[9px] font-black transition-all",
                                  col.percentageMode === m.id
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-blue-400 hover:bg-blue-100",
                                )}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex w-full items-center gap-1 border-t border-slate-100 pt-2">
                          <button
                            onClick={() => moveColumn(idx, "left")}
                            className="flex-1 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all active:scale-90"
                          >
                            <ArrowLeft className="w-4 h-4 mx-auto" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200" />
                          <button
                            onClick={() => deleteColumn(col.id)}
                            className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200" />
                          <button
                            onClick={() => moveColumn(idx, "right")}
                            className="flex-1 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all active:scale-90"
                          >
                            <ArrowRight className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-900 rotate-45" />
                      </div>
                    )}
                  </th>
                ))}
                {editable && (
                  <th className="w-12 no-print bg-slate-800 text-[9px] uppercase tracking-widest text-slate-400">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row: any, index: number) => (
                <MemoizedRow
                  key={row.id}
                  row={row}
                  index={index}
                  columns={table.columns}
                  editable={editable}
                  updateRowValue={updateRowValue}
                  deleteRow={deleteRow}
                  getCellValue={getCellValue}
                  formatNum={formatNum}
                />
              ))}
            </tbody>
          </table>
          {editable && (
            <div className="flex gap-3 mt-6 no-print">
              <Button
                onClick={addRow}
                className="h-10 px-6 text-xs font-black bg-slate-900 hover:bg-black text-white rounded-xl active:scale-95 transition-all"
              >
                행 추가
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-6 text-xs font-black border-2 border-dashed border-slate-300 rounded-xl"
              >
                열 추가
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsFormulaModalOpen(true)}
                className="h-10 px-6 text-xs font-black border-2 border-slate-900 rounded-xl shadow-sm active:scale-95 transition-all"
              >
                계산식 설정
              </Button>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-8 pdf-section">
          <div className="flex justify-end">
            <div className="w-[300px] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>공급가액</span>
                <span className="font-bold">
                  ₩ {supplyAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                <label className="flex items-center gap-2">
                  <span>부가가치세 (10%)</span>
                  <input
                    type="checkbox"
                    checked={table.vatIncluded}
                    onChange={(e) =>
                      setTable({ ...table, vatIncluded: e.target.checked })
                    }
                    className="w-4 h-4 no-print"
                  />
                </label>
                <span className="font-bold">
                  ₩ {vatAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg py-2 border-t border-slate-900 mt-2">
                <span className="font-black">합 계</span>
                <span className="font-black text-2xl">
                  ₩ {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-400">
              비고 / 특이사항
            </h4>
            <div className="relative">
              <textarea
                value={footer.terms}
                onChange={(e) =>
                  setFooter({ ...footer, terms: e.target.value })
                }
                className="w-full min-h-[100px] border border-slate-100 p-4 text-xs bg-slate-50/50 block [.is-exporting-pdf_&]:hidden"
              />
              <div className="hidden [.is-exporting-pdf_&]:block text-xs leading-relaxed whitespace-pre-wrap py-2">
                {footer.terms || "-"}
              </div>
            </div>
          </div>
          <div className="pt-12 flex justify-between items-end border-t border-slate-900 text-[10px] text-slate-400 font-medium">
            <div>
              위와 같이 견적을 제출합니다.
              <br />
              발행일자: {header.date}
            </div>
            <div className="flex items-center gap-4 text-slate-900 text-right">
              <div className="text-xl font-black italic">Architet Group</div>
              <div className="w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold rotate-12 opacity-80 border-dashed">
                (인)
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    [
      header,
      table,
      footer,
      editable,
      activeColIdx,
      updateHeader,
      updateRowValue,
      deleteRow,
      addRow,
      formatNum,
      moveColumn,
      deleteColumn,
      updateColumnLabel,
      updateColumnWidth,
      updateColumnType,
      updatePercentageMode,
    ],
  );

  return (
    <div className="flex justify-center bg-slate-100 py-12 min-h-screen">
      {a4Canvas}
      <AddColumnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddColumn}
      />
      <FormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        table={table}
        onUpdateFormula={updateFormula}
        onUpdateTotalCol={(id: any) => setTable({ ...table, totalColId: id })}
      />
    </div>
  );
}
