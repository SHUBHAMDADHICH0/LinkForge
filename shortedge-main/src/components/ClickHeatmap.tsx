import { useMemo } from "react";

interface HeatmapDataPoint {
  day: string;
  hour: number;
  clicks: number;
}

interface Props {
  data: HeatmapDataPoint[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColor(value: number, max: number): string {
  if (max === 0) return "hsl(220, 14%, 95%)";
  const intensity = value / max;
  if (intensity < 0.15) return "hsl(250, 84%, 95%)";
  if (intensity < 0.3) return "hsl(250, 84%, 85%)";
  if (intensity < 0.5) return "hsl(250, 84%, 72%)";
  if (intensity < 0.7) return "hsl(250, 84%, 60%)";
  return "hsl(250, 84%, 48%)";
}

export function ClickHeatmap({ data }: Props) {
  const maxClicks = useMemo(() => Math.max(...data.map((d) => d.clicks), 1), [data]);

  const getClicks = (day: string, hour: number) => {
    const point = data.find((d) => d.day === day && d.hour === hour);
    return point?.clicks ?? 0;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-1">
            <div className="w-10 shrink-0" />
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">
                {h % 3 === 0 ? `${h.toString().padStart(2, "0")}` : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day) => (
            <div key={day} className="flex mb-0.5">
              <div className="w-10 shrink-0 text-xs text-muted-foreground flex items-center">
                {day}
              </div>
              {HOURS.map((hour) => {
                const clicks = getClicks(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="flex-1 aspect-square mx-px rounded-sm transition-colors cursor-pointer relative group"
                    style={{ backgroundColor: getColor(clicks, maxClicks) }}
                    title={`${day} ${hour}:00 — ${clicks} clicks`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {clicks} clicks
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: getColor(i * maxClicks, maxClicks) }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
