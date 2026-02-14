import { Link, useLocation } from "wouter";
import { Film, Heart, History, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/", label: "Discover", icon: Sparkles },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary">
          <img src="/favicon.png" alt="CINE-AI" className="w-7 h-7" />
          <span className="font-display font-bold text-lg tracking-wide">CINE-AI</span>
        </div>
        <button onClick={() => logout()} className="p-2 text-muted-foreground hover:text-foreground">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 fixed h-screen glass border-r border-white/5 z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 text-primary mb-10">
            <img src="/favicon.png" alt="CINE-AI" className="w-9 h-9" />
            <span className="font-display font-bold text-2xl tracking-wide">CINE-AI</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 flex justify-around p-4 z-50">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
