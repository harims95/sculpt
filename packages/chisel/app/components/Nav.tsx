"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  // Hide nav on the agent chat page and sculpt conversation
  const hidden = pathname.startsWith("/agent/") || pathname === "/sculpt";
  if (hidden) return null;

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b"
      style={{ borderColor: "var(--rock-border)", background: "var(--background)" }}>
      <Link href="/" className="font-bold text-sm tracking-wide"
        style={{ color: "var(--sculptor-primary)" }}>
        Sculpt
      </Link>
      <div className="flex items-center gap-6">
        <NavLink href="/dashboard" label="Dashboard" current={pathname} />
        <NavLink href="/sculpt" label="New Agent" current={pathname} highlight />
      </div>
    </nav>
  );
}

function NavLink({ href, label, current, highlight }: {
  href: string; label: string; current: string; highlight?: boolean;
}) {
  const active = current === href;
  if (highlight) {
    return (
      <Link href={href}
        className="px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
        {label}
      </Link>
    );
  }
  return (
    <Link href={href} className="text-sm transition-colors"
      style={{ color: active ? "var(--sculptor-text)" : "var(--rock-muted)" }}>
      {label}
    </Link>
  );
}
