"use client";

import { createReactBlockSpec } from "@blocknote/react";
import { Box, Text, TextInput, Stack, Group } from "@mantine/core";
import { Info, Truck, FileCheck } from "lucide-react";
import { useState } from "react";

const NoticeComponent = ({ 
  block, 
  editor 
}: { 
  block: any; 
  editor: any; 
}) => {
  const [title, setTitle] = useState(block.props?.title || "비고 및 특이사항");
  const [content, setContent] = useState(block.props?.content || "");
  const isEditable = editor.isEditable;

  const updateBlock = (newTitle: string, newContent: string) => {
    if (!isEditable) return;
    editor.updateBlock(block, {
      props: {
        ...block.props,
        title: newTitle,
        content: newContent,
      },
    });
  };

  return (
    <Box className={`my-6 p-6 border-l-4 border-slate-900 bg-slate-50 rounded-r-2xl ${!isEditable ? "shadow-none" : ""}`}>
      <Stack gap="sm">
        <Group gap="xs">
          <Info size={18} className="text-slate-900" />
          <TextInput
            variant="unstyled"
            value={title}
            readOnly={!isEditable}
            onChange={(e) => {
              setTitle(e.target.value);
              updateBlock(e.target.value, content);
            }}
            styles={{
              input: { fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a", padding: 0, minHeight: "unset" }
            }}
          />
        </Group>
        <TextInput
          variant="unstyled"
          placeholder="납기, 선정 사유, 결제 조건 등을 입력하세요."
          value={content}
          readOnly={!isEditable}
          onChange={(e) => {
            setContent(e.target.value);
            updateBlock(title, e.target.value);
          }}
          styles={{
            input: { fontSize: "0.9rem", color: "#444", padding: 0, minHeight: "unset" }
          }}
        />
      </Stack>
    </Box>
  );
};

export const NoticeBlock = createReactBlockSpec(
  {
    type: "notice",
    propSchema: {
      title: { default: "비고 및 특이사항" },
      content: { default: "" },
    },
    content: "none",
  } as any,
  {
    render: (props: any) => <NoticeComponent {...props} />,
  },
);
