"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Check existing session (from callback exchange or cookie)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
    });

    // Also listen for auth state changes (e.g. PASSWORD_RECOVERY event or token hash processing)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error("Authentication service is temporarily unavailable.");
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to update password. Your reset link may have expired. Please request a new recovery link."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LiquidSurface calm />
      <main
        className="page-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          minHeight: "100vh",
        }}
      >
        <div className="glass-panel" style={{ padding: "2.5rem", maxWidth: 440, width: "100%" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1
              className="font-display"
              style={{ fontSize: "1.65rem", fontWeight: 700, marginBottom: "0.5rem" }}
            >
              Set New Password
            </h1>
            <p className="text-muted" style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
              Choose a strong, secure password for your CareVerse account.
            </p>
          </div>

          {success ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div
                style={{
                  background: "var(--surface-cream)",
                  border: "1.5px solid var(--accent-forest)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "var(--accent-forest)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                ✓ Your password has been successfully updated! You can now sign in with your new credentials.
              </div>
              <Link
                href="/?auth=login"
                className="btn btn-primary"
                style={{ textAlign: "center", textDecoration: "none", width: "100%", padding: "0.75rem" }}
              >
                Sign In to CareVerse →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input"
                    placeholder="Re-enter your password"
                  />
                </div>

                {error && (
                  <div
                    className="form-error"
                    role="alert"
                    style={{
                      fontSize: "0.8125rem",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "6px",
                      color: "#dc2626",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: "100%", marginTop: "0.5rem", padding: "0.75rem" }}
                >
                  {loading ? "Updating Password…" : "Update Password →"}
                </button>

                <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                  <Link
                    href="/?auth=login"
                    style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textDecoration: "underline" }}
                  >
                    ← Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
