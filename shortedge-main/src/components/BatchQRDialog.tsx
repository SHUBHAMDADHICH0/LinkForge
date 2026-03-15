import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ShortenedLink } from "@/types/link";
import { toast } from "sonner";

interface Props {
  links: ShortenedLink[];
  open: boolean;
  onClose: () => void;
}

export function BatchQRDialog({ links, open, onClose }: Props) {
  const downloadAll = () => {
    links.forEach((link, i) => {
      const svg = document.getElementById(`batch-qr-${link.id}`);
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
    });
    toast.success(`Downloading ${links.length} QR codes`);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Batch QR Codes ({links.length})</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {links.map((link) => (
            <div key={link.id} className="flex flex-col items-center gap-2 rounded-xl border p-4">
              <QRCodeSVG
                id={`batch-qr-${link.id}`}
                value={`https://${link.shortUrl}`}
                size={120}
                fgColor="hsl(230,25%,12%)"
                bgColor="transparent"
                level="H"
              />
              <p className="font-mono text-xs text-muted-foreground text-center truncate w-full">
                {link.shortUrl}
              </p>
            </div>
          ))}
        </div>
        <Button variant="hero" onClick={downloadAll} className="w-full">
          <Download className="h-4 w-4 mr-2" /> Download All as PNG
        </Button>
      </DialogContent>
    </Dialog>
  );
}
