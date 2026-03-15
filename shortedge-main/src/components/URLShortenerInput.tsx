import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Copy, Check, Loader2 } from "lucide-react";
import { shortenUrl } from "@/services/api";
import { toast } from "sonner";

export function URLShortenerInput() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    try {
      setLoading(true);
      const link = await shortenUrl({ url: url.trim() });
      setShortUrl(link.shortUrl);
      toast.success("Link shortened successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-xl border border-primary/20 bg-card/10 backdrop-blur-sm p-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here..."
          className="h-12 border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-0 text-base"
          onKeyDown={(e) => e.key === "Enter" && handleShorten()}
        />
        <Button
          variant="hero"
          size="lg"
          className="h-12 px-6 shrink-0"
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Shorten <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {shortUrl && (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
          <span className="text-primary-foreground/80 font-mono text-lg">{shortUrl}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="border-primary/30 bg-primary/10 text-primary-foreground hover:bg-primary/20"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
    </div>
  );
}
