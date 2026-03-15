import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, MousePointerClick, Smartphone, Monitor, Tablet, Globe,
  Clock, Tag, BarChart3
} from "lucide-react";
import { getAnalytics } from "@/services/api";
import { LinkAnalytics } from "@/types/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { motion } from "framer-motion";
import { ClickHeatmap } from "@/components/ClickHeatmap";
import { UTMBreakdown } from "@/components/UTMBreakdown";

const COLORS = ["hsl(250,84%,54%)", "hsl(170,80%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,14%,70%)"];

const AnalyticsPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shortCode) {
      getAnalytics(shortCode).then((data) => {
        setAnalytics(data);
        setLoading(false);
      });
    }
  }, [shortCode]);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading analytics…
      </div>
    );
  }

  const deviceIcons: Record<string, React.ReactNode> = {
    Mobile: <Smartphone className="h-4 w-4" />,
    Desktop: <Monitor className="h-4 w-4" />,
    Tablet: <Tablet className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold font-heading">Analytics</h1>
            <p className="text-xs text-muted-foreground font-mono">linkforge.app/{shortCode}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Total clicks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card gradient-primary">
            <CardContent className="flex items-center gap-4 p-8">
              <MousePointerClick className="h-10 w-10 text-primary-foreground/80" />
              <div>
                <p className="text-sm text-primary-foreground/70">Total Clicks</p>
                <p className="text-4xl font-bold font-heading text-primary-foreground">
                  {analytics.totalClicks.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time-based analytics tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" /> Click Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily">
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="hourly">Hourly</TabsTrigger>
                  <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.dailyClicks}>
                      <defs>
                        <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(250,84%,54%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(250,84%,54%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
                      <XAxis dataKey="date" stroke="hsl(220,10%,46%)" fontSize={12} />
                      <YAxis stroke="hsl(220,10%,46%)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,100%)", border: "1px solid hsl(220,14%,89%)", borderRadius: "8px", fontSize: "13px" }} />
                      <Area type="monotone" dataKey="clicks" stroke="hsl(250,84%,54%)" strokeWidth={2} fill="url(#clickGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="hourly">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.hourlyClicks}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,89%)" />
                      <XAxis dataKey="hour" stroke="hsl(220,10%,46%)" fontSize={10} interval={2} />
                      <YAxis stroke="hsl(220,10%,46%)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(0,0%,100%)", border: "1px solid hsl(220,14%,89%)", borderRadius: "8px", fontSize: "13px" }} />
                      <Bar dataKey="clicks" fill="hsl(170,80%,42%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="heatmap">
                  <ClickHeatmap data={analytics.heatmapData} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* UTM Tracking */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <UTMBreakdown data={analytics.utmBreakdown} />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Device breakdown */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-heading">Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={analytics.deviceBreakdown}
                        dataKey="count"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        strokeWidth={0}
                      >
                        {analytics.deviceBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {analytics.deviceBreakdown.map((d, i) => (
                    <div key={d.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="flex items-center gap-1.5 text-sm">
                          {deviceIcons[d.device]} {d.device}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Country breakdown */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" /> Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.countryBreakdown.map((c, i) => (
                  <div key={c.country}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{c.country}</span>
                      <span className="font-medium">{c.count.toLocaleString()} ({c.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${c.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Referrers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {analytics.referrerBreakdown.map((r, i) => (
                  <div key={r.referrer} className="rounded-xl border bg-muted/30 p-4 text-center">
                    <p className="text-2xl font-bold font-heading" style={{ color: COLORS[i % COLORS.length] }}>
                      {r.percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{r.referrer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
