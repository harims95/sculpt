"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Nav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  // Hide nav on agent chat and sculpt conversation pages
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
        {isSignedIn ? (
          <>
            <NavLink href="/dashboard" label="Dashboard" current={pathname} />
            <NavLink href="/sculpt" label="New Agent" current={pathname} highlight />
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="text-sm transition-colors" style={{ color: "var(--rock-muted)" }}>
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--sculptor-primary)", color: "var(--sculptor-surface)" }}>
                Get started
              </button>
            </SignUpButton>
          </>
        )}
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
