"use client";

import {
  defaultBlockSpecs,
  BlockNoteSchema,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";
import { useEffect, useMemo } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@mantine/core/styles.css";

import { PricingTableBlock } from "./PricingTableBlock";

interface EditorProps {
  onChange: (blocks: any[]) => void;
  initialContent?: any[];
  editable?: boolean;
}

export default function Editor({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) {
  const schema = useMemo(() => {
    return BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        pricingTable: PricingTableBlock,
      },
    });
  }, []);

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent,
  });

  useEffect(() => {
    const handleInsert = (e: any) => {
      const type = e.detail;
      editor.insertBlocks(
        [{ type: type as any }],
        editor.getTextCursorPosition().block,
        "after",
      );
    };

    window.addEventListener("insert-block", handleInsert);
    return () => window.removeEventListener("insert-block", handleInsert);
  }, [editor]);

  return (
    <MantineProvider>
      <div className="w-full bg-white rounded-[24px] shadow-sm border border-slate-100 min-h-[700px] p-10">
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="light"
          onChange={() => {
            onChange(editor.document);
          }}
        />
      </div>
    </MantineProvider>
  );
}
