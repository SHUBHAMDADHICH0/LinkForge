import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "lucide-react";
import { UTMEntry } from "@/types/link";

interface Props {
  data: {
    sources: UTMEntry[];
    mediums: UTMEntry[];
    campaigns: UTMEntry[];
  };
}

const COLORS = ["hsl(250,84%,54%)", "hsl(170,80%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,14%,70%)"];

function UTMTable({ entries }: { entries: UTMEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div key={entry.value}>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium font-mono text-sm">
              {entry.value}
            </span>
            <span className="text-muted-foreground">
              {entry.clicks.toLocaleString()} clicks · {entry.percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${entry.percentage}%`,
                backgroundColor: COLORS[i % COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UTMBreakdown({ data }: Props) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Tag className="h-5 w-5 text-muted-foreground" /> UTM Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="source">
          <TabsList className="mb-4">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="campaign">Campaign</TabsTrigger>
          </TabsList>
          <TabsContent value="source">
            <UTMTable entries={data.sources} />
          </TabsContent>
          <TabsContent value="medium">
            <UTMTable entries={data.mediums} />
          </TabsContent>
          <TabsContent value="campaign">
            <UTMTable entries={data.campaigns} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
