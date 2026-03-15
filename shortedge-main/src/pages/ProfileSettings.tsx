import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Link2, Save, Loader2, User, Mail, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ProfileSettings = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [autoQr, setAutoQr] = useState(
    (profile?.preferences as Record<string, unknown>)?.autoGenerateQr === true
  );
  const [defaultExpiry, setDefaultExpiry] = useState(
    ((profile?.preferences as Record<string, unknown>)?.defaultExpiryDays as number) || 0
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          preferences: {
            autoGenerateQr: autoQr,
            defaultExpiryDays: defaultExpiry,
          },
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-heading">Profile Settings</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={user?.email || ""} disabled className="pl-10 bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                {avatarUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="h-12 w-12 rounded-full object-cover border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Link Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-generate QR Codes</p>
                  <p className="text-xs text-muted-foreground">Automatically create a QR code when shortening a link</p>
                </div>
                <Switch checked={autoQr} onCheckedChange={setAutoQr} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Default Link Expiry (days)</Label>
                <Input
                  type="number"
                  min={0}
                  value={defaultExpiry}
                  onChange={(e) => setDefaultExpiry(parseInt(e.target.value) || 0)}
                  placeholder="0 = never expires"
                />
                <p className="text-xs text-muted-foreground">Set to 0 for links that never expire</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <Link to="/settings/domains" className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">Custom Domains</p>
                    <p className="text-xs text-muted-foreground">Configure branded short link domains</p>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;
