import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Link2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const BASE_URL = "https://api.linkforge.app";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  requestBody?: string;
  responseBody: string;
  params?: { name: string; type: string; desc: string }[];
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/api/shorten",
    description: "Create a new shortened link. Optionally provide a custom alias and expiry date.",
    auth: true,
    requestBody: JSON.stringify({ url: "https://example.com/long-url", customAlias: "my-link", expiresAt: "2026-12-31T23:59:59Z" }, null, 2),
    responseBody: JSON.stringify({ id: "clx1a2b3c", originalUrl: "https://example.com/long-url", shortCode: "my-link", shortUrl: "linkforge.app/my-link", createdAt: "2026-03-08T12:00:00Z", clicks: 0, customAlias: "my-link", expiresAt: "2026-12-31T23:59:59Z" }, null, 2),
  },
  {
    method: "GET",
    path: "/api/links",
    description: "Retrieve all shortened links for the authenticated user.",
    auth: true,
    responseBody: JSON.stringify([{ id: "clx1a2b3c", originalUrl: "https://example.com/long-url", shortCode: "my-link", shortUrl: "linkforge.app/my-link", createdAt: "2026-03-08T12:00:00Z", clicks: 142, lastAccessedAt: "2026-03-08T10:30:00Z" }], null, 2),
  },
  {
    method: "GET",
    path: "/api/analytics/{shortCode}",
    description: "Get detailed analytics for a specific short link including click history, device breakdown, geography, referrers, and UTM data.",
    auth: true,
    params: [{ name: "shortCode", type: "string", desc: "The short code or custom alias of the link" }],
    responseBody: JSON.stringify({ shortCode: "my-link", totalClicks: 1842, dailyClicks: [{ date: "2026-03-01", clicks: 120 }], deviceBreakdown: [{ device: "Mobile", count: 1105, percentage: 60 }], countryBreakdown: [{ country: "United States", count: 738, percentage: 40 }], referrerBreakdown: [{ referrer: "Twitter/X", count: 552, percentage: 30 }], utmBreakdown: { sources: [{ value: "instagram", clicks: 520, percentage: 28 }], mediums: [{ value: "social", clicks: 980, percentage: 53 }], campaigns: [{ value: "summer26", clicks: 620, percentage: 34 }] } }, null, 2),
  },
  {
    method: "DELETE",
    path: "/api/links/{id}",
    description: "Delete a shortened link by its ID.",
    auth: true,
    params: [{ name: "id", type: "string", desc: "The unique ID of the link" }],
    responseBody: JSON.stringify({ success: true }, null, 2),
  },
  {
    method: "GET",
    path: "/{shortCode}",
    description: "Redirect to the original URL. This is the public endpoint hit when someone clicks a short link.",
    auth: false,
    params: [{ name: "shortCode", type: "string", desc: "The short code to resolve" }],
    responseBody: "302 Redirect → Original URL",
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-accent/15 text-accent border-accent/30",
  POST: "bg-primary/15 text-primary border-primary/30",
  PUT: "bg-warning/15 text-warning border-warning/30",
  DELETE: "bg-destructive/15 text-destructive border-destructive/30",
};

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="rounded-lg bg-muted/60 border p-4 text-xs font-mono overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

const ApiDocs = () => (
  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-heading">API Documentation</span>
        </div>
      </div>
    </header>

    <div className="container mx-auto max-w-3xl px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-heading font-semibold">Getting Started</h2>
            <p className="text-sm text-muted-foreground">
              The LinkForge API is a RESTful JSON API built with Spring Boot. All authenticated endpoints require a Bearer token in the <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">Authorization</code> header.
            </p>
            <CodeBlock label="Base URL" code={BASE_URL} />
            <CodeBlock label="Authentication Header" code={`Authorization: Bearer <your-jwt-token>`} />
          </CardContent>
        </Card>
      </motion.div>

      {endpoints.map((ep, i) => (
        <motion.div key={ep.path + ep.method} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (i + 1) }}>
          <Card className="shadow-card overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className={`font-mono text-xs px-2.5 py-0.5 ${methodColors[ep.method]}`}>
                  {ep.method}
                </Badge>
                <code className="font-mono text-sm font-semibold">{ep.path}</code>
                {ep.auth && <Badge variant="secondary" className="text-xs">Auth Required</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{ep.description}</p>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {ep.params && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Path Parameters</span>
                  <div className="mt-2 space-y-1.5">
                    {ep.params.map((p) => (
                      <div key={p.name} className="flex items-baseline gap-2 text-sm">
                        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{p.name}</code>
                        <span className="text-xs text-muted-foreground">({p.type})</span>
                        <span className="text-muted-foreground">— {p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {ep.requestBody && <CodeBlock label="Request Body" code={ep.requestBody} />}
              <CodeBlock label="Response" code={ep.responseBody} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ApiDocs;
