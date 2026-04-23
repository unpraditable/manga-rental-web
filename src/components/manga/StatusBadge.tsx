import { MangaStatus } from "@/types/manga";

const config: Record<MangaStatus, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-accent-50 text-accent-600" },
  rented: { label: "Rented", cls: "bg-amber-50 text-amber-700" },
  damaged: { label: "Damaged", cls: "bg-red-50 text-red-600" },
};

interface Props {
  status: MangaStatus;
  compact?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  compact,
  className = "",
}: Props) {
  const { label, cls } = config[status];
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cls} ${className}`}
    >
      {compact && status === "available" ? "✓" : label}
    </span>
  );
}
