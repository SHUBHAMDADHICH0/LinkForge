import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Link2 } from "lucide-react";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    const redirect = async () => {
      // Look up the link
      const code = shortCode.toLowerCase();
      const { data: link, error: linkError } = await supabase
        .from("links")
        .select("id, original_url, expires_at, clicks")
        .eq("short_code", code)
        .single();

      if (linkError || !link) {
        setError(true);
        return;
      }

      // Check expiration
      if (link.expires_at && new Date(link.expires_at) < new Date()) {
        setError(true);
        return;
      }

      // Detect device
      const ua = navigator.userAgent;
      let device = "Desktop";
      if (/mobile/i.test(ua)) device = "Mobile";
      else if (/tablet|ipad/i.test(ua)) device = "Tablet";

      // Record click event (fire and forget)
      supabase.from("click_events").insert({
        link_id: link.id,
        device,
        referrer: document.referrer || null,
        user_agent: ua,
      }).then(() => {});

      // Update click count
      supabase.from("links").update({
        clicks: (link.clicks || 0) + 1,
        last_accessed_at: new Date().toISOString(),
      }).eq("id", link.id).then(() => {});

      // Redirect
      window.location.href = link.original_url;
    };

    redirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
          <Link2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-heading">Link Not Found</h1>
        <p className="text-muted-foreground">This link doesn't exist or has expired.</p>
        <a href="/" className="text-primary underline text-sm">Go to LinkForge →</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Redirecting…</p>
    </div>
  );
};

export default RedirectPage;
