import { TYPE_BADGE, type DesignPatternType } from "@/types/designPattern";

export function TypeBadge({
  type,
  withSuffix = true
}: {
  type: DesignPatternType;
  withSuffix?: boolean;
}) {
  const s = TYPE_BADGE[type];
  return (
    <span
      className="inline-flex items-center rounded-[7px] px-2.5 py-1 text-xs font-medium"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {type}
      {withSuffix ? " Design Pattern" : ""}
    </span>
  );
}
