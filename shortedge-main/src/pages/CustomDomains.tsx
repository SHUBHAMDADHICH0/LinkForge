import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Link2, Globe, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CustomDomain {
  id: string;
  domain: string;
  status: "verifying" | "active" | "failed";
  addedAt: string;
}

const mockDomains: CustomDomain[] = [
  { id: "1", domain: "go.acme.co", status: "active", addedAt: "2026-03-01" },
  { id: "2", domain: "links.example.com", status: "verifying", addedAt: "2026-03-07" },
];

const statusConfig = {
  active: { label: "Active", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  verifying: { label: "Verifying", icon: Loader2, className: "bg-warning/15 text-warning border-warning/30" },
  failed: { label: "Failed", icon: AlertCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const CustomDomains = () => {
  const [domains, setDomains] = useState<CustomDomain[]>(mockDomains);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newDomain.trim()) return;
    setAdding(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const domain: CustomDomain = {
      id: Date.now().toString(),
      domain: newDomain.trim().toLowerCase(),
      status: "verifying",
      addedAt: new Date().toISOString(),
    };
    setDomains((prev) => [...prev, domain]);
    setNewDomain("");
    setAdding(false);
    toast.success("Domain added! DNS verification will begin shortly.");
  };

  const handleRemove = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    toast.success("Domain removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-heading">Custom Domains</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" /> Add a Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use your own domain for branded short links (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">go.yourcompany.com</code>).
                Add a CNAME record pointing to <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">links.linkforge.app</code>.
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="sr-only">Domain</Label>
                  <Input
                    placeholder="go.yourcompany.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
                <Button variant="hero" onClick={handleAdd} disabled={adding || !newDomain.trim()}>
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1.5" />}
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-base">Your Domains</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {domains.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Globe className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No custom domains yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {domains.map((d) => {
                    const sc = statusConfig[d.status];
                    return (
                      <div key={d.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-mono text-sm font-semibold">{d.domain}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Added {new Date(d.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${sc.className}`}>
                            <sc.icon className={`h-3 w-3 mr-1 ${d.status === "verifying" ? "animate-spin" : ""}`} />
                            {sc.label}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleRemove(d.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card border-dashed">
            <CardContent className="p-5">
              <h3 className="font-heading font-semibold text-sm mb-2">DNS Configuration</h3>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>To verify your domain, add the following DNS records at your registrar:</p>
                <div className="rounded-lg bg-muted/60 border p-3 font-mono space-y-1">
                  <p><span className="text-foreground font-semibold">CNAME</span> &nbsp; your-subdomain → links.linkforge.app</p>
                  <p><span className="text-foreground font-semibold">TXT</span> &nbsp;&nbsp;&nbsp; _linkforge → linkforge-verify=your-token</p>
                </div>
                <p>DNS changes can take up to 72 hours to propagate. SSL is provisioned automatically once verified.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomDomains;
