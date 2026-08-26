import type { CacheSaveProgress } from "../../lib/use-cache-save-progress";
import { formatCacheSaveProgressLabel } from "../../lib/use-cache-save-progress";

type CacheProgressBadgeProps = {
  progress: CacheSaveProgress;
};

export default function CacheProgressBadge({ progress }: CacheProgressBadgeProps) {
  const complete = progress.total > 0 && progress.ready && progress.saved >= progress.total;

  return (
    <span
      className="badge"
      title="Saved in Cache Storage"
      style={
        complete
          ? {
              color: "var(--status-online-color)",
              background: "var(--status-online-background)",
              borderColor: "var(--status-online-border)",
            }
          : undefined
      }
    >
      {formatCacheSaveProgressLabel(progress)}
    </span>
  );
}
