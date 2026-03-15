import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Link2, BarChart3, MousePointerClick, Plus, Copy, Check, Trash2, ExternalLink,
  QrCode, Clock, Search, TrendingUp, Globe, LogOut, User, Download, Settings,
  CheckSquare, Tag, Activity, ArrowUpRight, Sparkles, Zap
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getLinks, deleteLink } from "@/services/api";
import { ShortenedLink } from "@/types/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import { BatchQRDialog } from "@/components/BatchQRDialog";
import { TagFilter, LinkTags, InlineTagPicker } from "@/components/TagFilter";
import { useTags } from "@/hooks/useTags";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [qrLink, setQrLink] = useState<ShortenedLink | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchQrOpen, setBatchQrOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { tags, allTagNames, getTagNames, getTagId, createTag, addTagToLink, removeTagFromLink } = useTags();

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await getLinks();
      setLinks(data);
    } catch (err: any) {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter((l) => !l.expiresAt || new Date(l.expiresAt) > new Date()).length;
  const avgClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;

  const filtered = links.filter((l) => {
    const matchesSearch =
      l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      activeTags.size === 0 || getTagNames(l.id).some((t) => activeTags.has(t));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const n = new Set(prev);
      if (n.has(tag)) n.delete(tag); else n.add(tag);
      return n;
    });
  };

  const handleAddTagToLink = async (linkId: string, tagName: string) => {
    const tagId = getTagId(tagName);
    if (tagId) await addTagToLink(linkId, tagId);
  };

  const handleRemoveTagFromLink = async (linkId: string, tagName: string) => {
    const tagId = getTagId(tagName);
    if (tagId) await removeTagFromLink(linkId, tagId);
  };

  const handleCreateAndAddTag = async (linkId: string, name: string) => {
    const tag = await createTag(name);
    if (tag) await addTagToLink(linkId, tag.id);
  };

  const handleCopy = async (link: ShortenedLink) => {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    toast.success("Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete link");
    }
  };

  const handleCreated = () => {
    fetchLinks();
    setCreateOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out");
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    for (const id of ids) await deleteLink(id);
    setLinks((prev) => prev.filter((l) => !selected.has(l.id)));
    toast.success(`${ids.length} links deleted`);
    setSelected(new Set());
  };

  const handleExportCSV = () => {
    const selectedLinks = links.filter((l) => selected.has(l.id));
    const rows = [
      ["Short URL", "Original URL", "Created", "Clicks", "Last Accessed", "Custom Alias", "Expires"].join(","),
      ...selectedLinks.map((l) =>
        [
          `https://${l.shortUrl}`,
          `"${l.originalUrl}"`,
          l.createdAt,
          l.clicks,
          l.lastAccessedAt || "",
          l.customAlias || "",
          l.expiresAt || "",
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkforge-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${selectedLinks.length} links`);
  };

  const selectedLinks = links.filter((l) => selected.has(l.id));

  // Recent activity (last 5 links)
  const recentLinks = links.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-heading">LinkForge</span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground hidden sm:flex items-center gap-1.5">
                <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {(profile?.display_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{profile?.display_name || user.email}</span>
              </span>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings"><Settings className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl gradient-primary p-6 md:p-8 shadow-elevated relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground/70">Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-primary-foreground">
              Welcome back, {profile?.display_name || user?.email?.split("@")[0] || "User"}! 👋
            </h1>
            <p className="mt-1 text-primary-foreground/60">Here's your link performance at a glance.</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            { label: "Total Links", value: links.length, icon: Link2, color: "text-primary", bg: "bg-primary/10" },
            { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-accent", bg: "bg-accent/10" },
            { label: "Active Links", value: activeLinks, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
            { label: "Avg. Clicks/Link", value: avgClicks, icon: Activity, color: "text-warning", bg: "bg-warning/10" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="shadow-card hover:shadow-elevated transition-shadow border-border/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold font-heading">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Activity */}
        {recentLinks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-mono font-medium text-primary truncate">{link.shortCode}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">{link.originalUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold">{link.clicks} clicks</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                          <Link to={`/analytics/${link.shortCode}`}>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search links..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button variant="hero" onClick={() => setCreateOpen(true)} className="shadow-elevated">
            <Plus className="mr-2 h-4 w-4" /> Create Link
          </Button>
        </div>

        {/* Tag filter */}
        {allTagNames.length > 0 && (
          <div className="mb-4">
            <TagFilter allTags={allTagNames} activeTags={activeTags} onToggleTag={toggleTag} />
          </div>
        )}

        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3"
          >
            <span className="text-sm font-medium">
              {selected.size} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => setBatchQrOpen(true)}>
                <QrCode className="h-3.5 w-3.5 mr-1.5" /> QR Codes
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
              </Button>
            </div>
          </motion.div>
        )}

        {/* Links Table */}
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">Your Links</CardTitle>
              {filtered.length > 0 && (
                <Button variant="ghost" size="sm" onClick={toggleSelectAll} className="text-xs">
                  <CheckSquare className="h-3.5 w-3.5 mr-1" />
                  {selected.size === filtered.length ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm">Loading your links…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Link2 className="h-8 w-8 opacity-40" />
                </div>
                <p className="font-medium">No links yet</p>
                <p className="text-sm mt-1">Create your first short link to get started!</p>
                <Button variant="hero" className="mt-4" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Link
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-muted/30 transition-colors ${selected.has(link.id) ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={selected.has(link.id)}
                        onCheckedChange={() => toggleSelect(link.id)}
                        className="mt-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-primary">{link.shortUrl}</span>
                          {link.customAlias && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">custom</span>
                          )}
                          {link.expiresAt && (
                            <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" /> expires
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground truncate max-w-lg">{link.originalUrl}</p>
                        <LinkTags
                          tags={getTagNames(link.id)}
                          onRemove={(tag) => handleRemoveTagFromLink(link.id, tag)}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created {format(new Date(link.createdAt), "MMM d, yyyy")}
                          {link.lastAccessedAt && ` · Last click ${format(new Date(link.lastAccessedAt), "MMM d, h:mm a")}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium bg-muted/50 rounded-lg px-3 py-1.5">
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(link)}>
                          {copiedId === link.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQrLink(link)}>
                          <QrCode className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                          <Link to={`/analytics/${link.shortCode}`}>
                            <BarChart3 className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                          <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <InlineTagPicker
                          allTags={allTagNames}
                          assignedTags={getTagNames(link.id)}
                          onAdd={(tag) => handleAddTagToLink(link.id, tag)}
                          onRemove={(tag) => handleRemoveTagFromLink(link.id, tag)}
                          onCreateAndAdd={(name) => handleCreateAndAddTag(link.id, name)}
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleDelete(link.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateLinkDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={handleCreated} />
      <QRCodeDialog link={qrLink} onClose={() => setQrLink(null)} />
      <BatchQRDialog links={selectedLinks} open={batchQrOpen} onClose={() => setBatchQrOpen(false)} />
    </div>
  );
};

export default Dashboard;
