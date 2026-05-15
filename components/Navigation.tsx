"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/onboarding") {
    return null;
  }

  const navItems = [
    { href: "/dashboard", icon: "🏠", label: "Home" },
    { href: "/mood", icon: "😊", label: "Mood" },
    { href: "/calendar", icon: "📅", label: "Calendar" },
    { href: "/chat", icon: "💬", label: "Chat" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Navigasi utama"
    >
      <div className="mx-3 mb-3">
        <Card padding="sm" className="rounded-rk-2xl px-0.5 py-0.5 shadow-rk-card-hover">
          <div className="flex h-14 items-center justify-around px-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-[3rem] flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1 transition-colors ${
                    isActive
                      ? "bg-gradient-cool text-white shadow-rk-btn-primary"
                      : "text-rk-muted motion-safe:hover:bg-white/60"
                  }`}
                >
                  <span className={`text-xl leading-none ${isActive ? "scale-105" : ""}`}>
                    {item.icon}
                  </span>
                  <span
                    className={`text-xs font-semibold leading-tight tracking-tight ${
                      isActive ? "text-white" : "text-rk-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </nav>
  );
}
