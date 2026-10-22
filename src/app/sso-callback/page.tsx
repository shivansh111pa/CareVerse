"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at center, rgba(16, 24, 48, 1) 0%, rgba(8, 12, 24, 1) 100%)",
        color: "#ffffff",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "420px", padding: "2rem" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(255, 255, 255, 0.15)",
            borderTopColor: "var(--accent-aqua, #6ee7de)",
            borderRadius: "50%",
            margin: "0 auto 1.5rem auto",
            animation: "careverse-spin 0.9s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes careverse-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          Authenticating with CareVerse…
        </h2>
        <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5 }}>
          Finalizing secure verification. You will be redirected to your dashboard in a moment.
        </p>
      </div>

      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
