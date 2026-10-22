"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { StethoscopeIcon } from "@/components/ui/Icons";

const clerkAppearance = {
  variables: {
    colorPrimary: "#0b5a42",
    colorText: "#18201a",
    colorBackground: "#fbf8f3",
    colorInputBackground: "#ffffff",
    colorInputText: "#18201a",
    borderRadius: "8px",
    fontFamily: "inherit",
  },
  elements: {
    card: {
      boxShadow: "none",
      border: "none",
      background: "transparent",
      padding: 0,
      width: "100%",
    },
    headerTitle: {
      fontFamily: "var(--font-display, inherit)",
      fontWeight: 700,
      fontSize: "1.25rem",
      color: "#0b5a42",
    },
    headerSubtitle: {
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    formButtonPrimary: {
      background: "var(--accent-forest, #0b5a42)",
      color: "#ffffff",
      border: "1.5px solid var(--border-dark, #18201a)",
      boxShadow: "2px 2px 0px #18201a",
      fontWeight: 700,
      fontSize: "0.875rem",
      textTransform: "none",
      "&:hover": {
        background: "#084734",
      },
    },
    footerActionLink: {
      color: "var(--accent-forest, #0b5a42)",
      fontWeight: 700,
    },
  },
};

export function AuthPanel() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signup") setTab("signup");
    if (authParam === "login") setTab("login");
  }, [searchParams]);

  return (
    <div className="auth-panel-wrap">
      <div className="glass-panel glass-panel--auth auth-panel">
        <div className="auth-panel__header">
          <div>
            <span
              className="clinic-stamp clinic-stamp--verified"
              style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
            >
              Secure Medical Portal
            </span>
            <h2 className="auth-panel__title" style={{ marginTop: "0.35rem" }}>
              Patient & Doctor Access
            </h2>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              background: "var(--accent-forest-light)",
              border: "1.5px solid var(--accent-forest)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-forest)",
            }}
          >
            <StethoscopeIcon style={{ width: 20, height: 20 }} />
          </div>
        </div>

        {/* If user is already signed in, show status & dashboard launch button */}
        <SignedIn>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.25rem",
              padding: "2rem 1rem",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <UserButton afterSignOutUrl="/" />
              <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Active CareVerse Session</span>
            </div>
            <p className="text-muted" style={{ fontSize: "0.875rem", maxWidth: "280px" }}>
              You are currently authenticated. Access your clinical dashboard, records, and appointments.
            </p>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.75rem", textAlign: "center", textDecoration: "none" }}
            >
              Enter Dashboard →
            </Link>
          </div>
        </SignedIn>

        {/* If user is signed out, show Clerk's Login or Registration component */}
        <SignedOut>
          <div className="auth-tabs" style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              data-active={tab === "login"}
              onClick={() => setTab("login")}
              style={{
                flex: 1,
                borderRadius: "8px",
                padding: "0.55rem 0.75rem",
                fontSize: "0.875rem",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              data-active={tab === "signup"}
              onClick={() => setTab("signup")}
              style={{
                flex: 1,
                borderRadius: "8px",
                padding: "0.55rem 0.75rem",
                fontSize: "0.875rem",
              }}
            >
              New Patient Register
            </button>
          </div>

          <div style={{ width: "100%", minHeight: "340px" }}>
            {tab === "login" ? (
              <SignIn
                routing="hash"
                fallbackRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            ) : (
              <SignUp
                routing="hash"
                fallbackRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            )}
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
