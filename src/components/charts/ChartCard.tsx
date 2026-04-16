import { type ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function ChartCard({ title, children }: Props) {
  return (
    <div className="rounded-xl border border-[#cfe1d7] bg-white p-4 shadow-[0_6px_18px_rgba(22,103,58,0.06)]">
      <h3 className="mb-3 text-base font-semibold text-[#123122]">{title}</h3>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}
