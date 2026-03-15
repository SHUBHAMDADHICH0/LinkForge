import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ShortenedLink } from "@/types/link";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  link: ShortenedLink | null;
  onClose: () => void;
}

export function QRCodeDialog({ link, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!link) return null;

  const fullUrl = `https://${link.shortUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.download = `${link.shortCode}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={!!link} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="font-heading">QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-xl border p-4 bg-card">
            <QRCodeSVG
              id="qr-code-svg"
              value={fullUrl}
              size={200}
              fgColor="hsl(230,25%,12%)"
              bgColor="transparent"
              level="H"
            />
          </div>
          <p className="font-mono text-sm text-muted-foreground">{link.shortUrl}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              Copy Link
            </Button>
            <Button variant="hero" size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5 mr-1" /> Download PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
