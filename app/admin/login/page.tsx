"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { IMAGES } from "@/lib/images";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Login failed.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[48%] overflow-hidden lg:block">
        <Image src={IMAGES.adminLogin} alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-navy/80 via-hero-navy/20 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <h2 className="font-display text-4xl font-medium leading-tight">
            Every detail, <em className="italic">handled.</em>
          </h2>
          <div className="mt-4 h-px w-16 bg-white/60" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
            Court document service you can rely on, across Durham Region and beyond.
          </p>
        </div>
      </div>

      <div className="safe-top safe-bottom relative flex min-w-0 flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#f4f7fb] via-white to-[#eef2f7] px-4 py-10 min-[400px]:px-6 min-[400px]:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <Image src={IMAGES.heroBg} alt="" fill className="object-cover" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_20px_60px_rgba(10,31,68,0.08)] min-[400px]:p-8"
          >
            <h1 className="font-display text-2xl text-hero-navy">Admin Login</h1>
            <p className="mt-1 text-sm text-hero-muted">Secure access to your admin dashboard.</p>
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            )}
            <label className="mt-6 block text-sm font-medium text-hero-navy">
              Email Address
              <div className="relative mt-1.5">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hero-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M4 6h16v12H4zM4 7l8 6 8-6" strokeWidth="1.5" />
                </svg>
                <input
                  type="email"
                  className="input input-icon-start"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
            <label className="mt-4 block text-sm font-medium text-hero-navy">
              Password
              <div className="relative mt-1.5">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hero-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.5" />
                  <path d="M8 11V8a4 4 0 018 0v3" strokeWidth="1.5" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  className="input input-icon-start input-icon-end"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 min-h-[44px] min-w-[44px] -translate-y-1/2 px-1 text-xs font-medium text-hero-muted hover:text-hero-navy"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-hero-navy py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Sign In
              <span aria-hidden>→</span>
            </button>
            <Link href="/" className="mt-6 block text-center text-sm text-hero-muted hover:text-hero-navy">
              ← Back to Website
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
