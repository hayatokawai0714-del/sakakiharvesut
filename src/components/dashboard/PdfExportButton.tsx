"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Props = {
  targetId: string;
};

export function PdfExportButton({ targetId }: Props) {
  const handleExport = async () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const canvas = await html2canvas(target, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    pdf.save("sakaki-harvest-dashboard.pdf");
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg border border-[#a8c4b4] bg-white px-4 py-2 text-sm font-semibold text-[#25543b] shadow-sm transition hover:bg-[#f2f8f5]"
    >
      PDF出力
    </button>
  );
}
