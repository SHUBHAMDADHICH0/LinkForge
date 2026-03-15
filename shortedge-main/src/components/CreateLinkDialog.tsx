import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { shortenUrl } from "@/services/api";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateLinkDialog({ open, onOpenChange, onCreated }: Props) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      await shortenUrl({
        url: url.trim(),
        customAlias: alias.trim() || undefined,
        expiresAt: expiry || undefined,
      });
      toast.success("Link created!");
      setUrl("");
      setAlias("");
      setExpiry("");
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Create New Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Destination URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/long-url" />
          </div>
          <div className="space-y-2">
            <Label>Custom Alias (optional)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">linkforge.app/</span>
              <Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="my-link" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Expiration Date (optional)</Label>
            <Input type="datetime-local" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Link <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
