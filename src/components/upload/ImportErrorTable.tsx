import type { ValidationError } from "@/types/harvest";

type Props = {
  errors: ValidationError[];
};

export function ImportErrorTable({ errors }: Props) {
  if (errors.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-rose-200 bg-rose-50/80">
      <h3 className="border-b border-rose-200 px-4 py-3 text-base font-semibold text-rose-800">
        取込エラー一覧（正常行のみ反映済み）
      </h3>
      <table className="min-w-full text-sm">
        <thead className="text-left text-rose-800">
          <tr>
            <th className="px-4 py-2">行番号</th>
            <th className="px-4 py-2">エラー理由</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error) => (
            <tr key={error.rowNumber} className="border-t border-rose-200">
              <td className="px-4 py-2">{error.rowNumber}</td>
              <td className="px-4 py-2">{error.reasons.join(" / ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
