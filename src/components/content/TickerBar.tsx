import { useContext } from "react";
import { DesignContext } from "../../context/DesignContext";
import type { TickerItem } from "../../lib/content-types";

type TickerBarProps = {
  items: TickerItem[];
};

export default function TickerBar({ items }: TickerBarProps) {
  const { design } = useContext(DesignContext);

  if (!items.length || !design) return null;

  const loopItems = [...items, ...items];

  return (
    <div className="ticker-shell">
      <div className="ticker-track">
        {loopItems.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="ticker-pill"
          >
            <span
              className="ticker-label"
              style={{
                borderColor: design.ticker[item.kind].borderColor,
                color: design.ticker[item.kind].color,
              }}
            >
              {item.label}
            </span>
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
