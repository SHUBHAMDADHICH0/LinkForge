import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Link2, BarChart3, QrCode, Zap, Shield, Clock,
  Globe, Users, TrendingUp, Star, CheckCircle2, Sparkles
} from "lucide-react";
import { URLShortenerInput } from "@/components/URLShortenerInput";
import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";

const Hero3D = lazy(() => import("@/components/Hero3D"));

const features = [
  { icon: Link2, title: "Custom Short Links", desc: "Create branded, memorable short URLs with custom aliases that boost click-through rates by 34%" },
  { icon: BarChart3, title: "Rich Analytics", desc: "Track clicks, devices, locations and referrers with beautiful real-time dashboards" },
  { icon: QrCode, title: "QR Codes", desc: "Auto-generate stunning QR codes for every shortened link — download in PNG or SVG" },
  { icon: Zap, title: "Instant Redirects", desc: "Lightning-fast redirects powered by edge infrastructure with <50ms latency worldwide" },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with 99.9% uptime guarantee and SSL encryption" },
  { icon: Clock, title: "Link Expiration", desc: "Set expiry dates, password protection, and click limits to control link availability" },
  { icon: Globe, title: "Custom Domains", desc: "Use your own branded domain for professional short links that build trust" },
  { icon: Users, title: "Team Collaboration", desc: "Invite team members, assign roles, and manage links together seamlessly" },
  { icon: TrendingUp, title: "UTM Tracking", desc: "Built-in UTM parameter builder and campaign tracking for marketing teams" },
];

const stats = [
  { label: "Links Shortened", value: 2500000, suffix: "+" },
  { label: "Clicks Tracked", value: 150000000, suffix: "+" },
  { label: "Active Users", value: 45000, suffix: "+" },
  { label: "Uptime", value: 99.9, suffix: "%" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Marketing Director, TechFlow", text: "LinkForge transformed our campaign tracking. We saw a 40% increase in click-through rates with branded short links.", avatar: "SC" },
  { name: "James Rodriguez", role: "Growth Lead, ScaleUp", text: "The analytics dashboard is incredible. We can see exactly where our traffic comes from and optimize in real-time.", avatar: "JR" },
  { name: "Emily Park", role: "CEO, DesignStudio", text: "Best link management tool we've used. The QR codes and custom domains are game-changers for our brand.", avatar: "EP" },
];

const pricingPlans = [
  { name: "Free", price: "$0", period: "forever", features: ["50 links/month", "Basic analytics", "QR codes", "Community support"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$12", period: "/month", features: ["Unlimited links", "Advanced analytics", "Custom domains", "UTM tracking", "Team collaboration", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Enterprise", price: "$49", period: "/month", features: ["Everything in Pro", "SSO & SAML", "API access", "Custom integrations", "Dedicated account manager", "SLA guarantee"], cta: "Contact Sales", popular: false },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatted = count >= 1000000
    ? `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1)}M`
    : count >= 1000
      ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
      : count.toString();

  return <span>{formatted}{suffix}</span>;
}

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-elevated">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-heading">LinkForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/docs" className="hover:text-foreground transition-colors">API</Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/login">Get Started Free <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-28 relative overflow-hidden">
        <Suspense fallback={null}><Hero3D /></Suspense>
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Trusted by 45,000+ marketers & developers
            </div>
            <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.1] tracking-tight text-primary-foreground md:text-7xl lg:text-8xl">
              Short Links,{" "}
              <span className="text-gradient">Big Impact</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/60 md:text-xl">
              Transform long, unwieldy URLs into powerful, trackable short links.
              Built for marketers, developers, and teams who demand more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-12 max-w-2xl"
          >
            <URLShortenerInput />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/40 flex-wrap"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Free forever plan</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Full API access</span>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold font-heading text-gradient">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">Features</span>
              <h2 className="mt-3 text-3xl font-bold font-heading md:text-5xl">
                Everything You Need to <span className="text-gradient">Grow</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                A complete link management platform with powerful features to supercharge your marketing.
              </p>
            </motion.div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative rounded-2xl border bg-card p-6 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-sm">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">Testimonials</span>
              <h2 className="mt-3 text-3xl font-bold font-heading md:text-5xl">
                Loved by <span className="text-gradient">Teams Worldwide</span>
              </h2>
            </motion.div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border bg-card p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">Pricing</span>
              <h2 className="mt-3 text-3xl font-bold font-heading md:text-5xl">
                Simple, <span className="text-gradient">Transparent</span> Pricing
              </h2>
              <p className="mt-4 text-muted-foreground">Start free. Scale as you grow. No hidden fees.</p>
            </motion.div>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 shadow-card ${
                  plan.popular
                    ? "border-primary/50 bg-card shadow-elevated scale-[1.02]"
                    : "bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold font-heading">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-heading">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full mt-8"
                  asChild
                >
                  <Link to="/login">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-heading text-primary-foreground md:text-5xl">
              Ready to forge your links?
            </h2>
            <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto text-lg">
              Join 45,000+ teams already using LinkForge to power their link strategy.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
              <Button variant="hero" size="lg" asChild>
                <Link to="/login">
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/docs">View API Docs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Link2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold font-heading">LinkForge</span>
              </div>
              <p className="text-sm text-muted-foreground">The modern link management platform for teams that demand more.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Features</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Pricing</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Changelog</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/docs" className="block hover:text-foreground transition-colors">API Docs</Link>
                <p className="hover:text-foreground cursor-pointer transition-colors">Blog</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Help Center</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</p>
                <p className="hover:text-foreground cursor-pointer transition-colors">Cookie Policy</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <span>© 2026 LinkForge. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:text-foreground cursor-pointer">Twitter</span>
              <span className="hover:text-foreground cursor-pointer">LinkedIn</span>
              <span className="hover:text-foreground cursor-pointer">GitHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
