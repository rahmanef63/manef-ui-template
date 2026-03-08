import { DashboardButtons } from "@/features/dashboard/components/DashboardButtons";
import { StickyHeader } from "@/components/layout/header/sticky-header";
import { Link } from "@/components/typography/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  LayoutDashboard,
  Lock,
  Sparkles,
  Workflow,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-foreground overflow-hidden selection:bg-primary/30">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <StickyHeader className="px-6 py-4 border-b border-white/5 bg-background/50 backdrop-blur-xl z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              OpenClaw
            </span>
          </div>
          <Suspense>
            <DashboardButtons />
          </Suspense>
        </div>
      </StickyHeader>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Next-Generation AI Workspace</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
              The ultimate infrastructure <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                built for autonomous agents
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
              OpenClaw is an advanced platform seamlessly combining real-time database capabilities, powerful Next.js integrations, and specialized agentic capabilities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all duration-300">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="https://github.com/xixixao/saas-starter" target="_blank" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  View Documentation
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-muted-foreground">Architected for speed, built for the future.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Syncing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Powered by Convex, state changes reflect instantly across all clients ensuring perfect synchrony for your agents.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enterprise Auth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Robust, battle-tested authentication using NextAuth. Secure your endpoints and manage permissions effortlessly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Native</h3>
                <p className="text-muted-foreground leading-relaxed">
                  First-class schemas and logic specifically mapped out to handle agent identities, memories, and task tracking.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group border-t-white/10 lg:col-span-2">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <LayoutDashboard className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Workspace & Tenant Built-in</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      Out-of-the-box support for modular, multi-tenant workspace environments. Users get isolated scopes while administrators maintain a global overview.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Modern Stack</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Next.js 14 App Router backend with the stunning aesthetics of Tailwind CSS and Radix UI components.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-sm text-muted-foreground mt-20 relative z-10">
          <p>© {new Date().getFullYear()} OpenClaw. Powered by Next.js & Convex.</p>
        </footer>
      </main>
    </div>
  );
}
