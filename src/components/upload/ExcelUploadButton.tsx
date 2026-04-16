"use client";

import { useRef } from "react";

type Props = {
  onSelect: (file: File) => Promise<void> | void;
  disabled?: boolean;
};

export function ExcelUploadButton({ onSelect, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={async (e) => {
          const input = e.currentTarget;
          const file = e.target.files?.[0];
          if (!file) return;
          await onSelect(file);
          input.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-[#1f8b4c] bg-[#1f8b4c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16673a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Excel取込
      </button>
    </>
  );
}
