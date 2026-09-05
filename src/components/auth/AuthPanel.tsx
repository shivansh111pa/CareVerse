"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  loginAction,
  signupAction,
  resetPasswordAction,
  googleSignInAction,
} from "@/app/actions/auth";
import { StethoscopeIcon } from "@/components/ui/Icons";
import type { AuthFormState, AuthTab } from "@/types";

const initialState: AuthFormState = {};

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      data-active={active}
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
      style={{
        flex: 1,
        borderRadius: "8px",
        padding: "0.55rem 0.75rem",
        fontSize: "0.875rem",
      }}
    >
      {label}
    </button>
  );
}

function SubmitButton({
  idleLabel,
  pendingLabel,
  className = "",
  style,
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`btn btn-primary ${className}`.trim()}
      disabled={pending}
      style={style}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

function GoogleOAuthSection({ label }: { label: string }) {
  return (
    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ flex: 1, height: "1.5px", background: "var(--border-subtle)" }}></div>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
          Or continue with
        </span>
        <div style={{ flex: 1, height: "1.5px", background: "var(--border-subtle)" }}></div>
      </div>
      <form action={googleSignInAction}>
        <button
          type="submit"
          className="btn btn-secondary"
          style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.65rem", fontSize: "0.875rem" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {label}
        </button>
      </form>
    </div>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  useEffect(() => {
    if (state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state?.redirectUrl]);

  return (
    <>
      <form key="login" action={formAction} className="auth-form-pane">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">
              Patient / Doctor Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="glass-input"
              placeholder="name@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="glass-input"
              placeholder="••••••••"
            />
          </div>
          {state?.error && <p className="form-error" role="alert">{state.error}</p>}
          <SubmitButton
            idleLabel="Sign In to Portal →"
            pendingLabel="Signing in…"
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </div>
      </form>
      <GoogleOAuthSection label="Sign in with Google" />
    </>
  );
}

function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState);

  return (
    <>
      <form key="signup" action={formAction} className="auth-form-pane">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-name">
              Patient Full Name
            </label>
            <input
              id="signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="glass-input"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-phone">
              Mobile Number <span className="text-muted">(for SMS reminders)</span>
            </label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="glass-input"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-email">
              Email Address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="glass-input"
              placeholder="patient@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-password">
              Create Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="glass-input"
              placeholder="Min. 6 characters"
            />
          </div>
          {state?.error && <p className="form-error" role="alert">{state.error}</p>}
          {state?.success && (
            <p className="form-success" style={{ color: "var(--accent-forest)", fontWeight: 600, fontSize: "0.875rem", background: "var(--accent-forest-light)", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--accent-forest)" }} role="status">
              {state.success}
            </p>
          )}
          <SubmitButton
            idleLabel="Create Patient Account"
            pendingLabel="Creating account…"
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </div>
      </form>
      <GoogleOAuthSection label="Sign up with Google" />
    </>
  );
}

function ResetForm({ onBack }: { onBack: () => void }) {
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  return (
    <form key="reset" action={formAction} className="auth-form-pane">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p className="text-muted" style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
          Enter your registered email address to receive secure password recovery instructions.
        </p>
        <div className="form-field">
          <label className="form-label" htmlFor="reset-email">
            Account Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="glass-input"
            placeholder="patient@example.com"
          />
        </div>
        {state?.error && <p className="form-error" role="alert">{state.error}</p>}
        {state?.success && (
          <p className="form-success" style={{ color: "var(--accent-forest)", fontWeight: 600, fontSize: "0.875rem" }} role="status">{state.success}</p>
        )}
        <SubmitButton idleLabel="Send Recovery Link" pendingLabel="Sending…" style={{ width: "100%" }} />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ width: "100%" }}
        >
          ← Back to Sign In
        </button>
      </div>
    </form>
  );
}

export function AuthPanel() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<AuthTab>("login");
  const [showReset, setShowReset] = useState(false);

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
            <span className="clinic-stamp clinic-stamp--verified" style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}>
              Secure Medical Portal
            </span>
            <h2 className="auth-panel__title" style={{ marginTop: "0.35rem" }}>
              Patient & Doctor Access
            </h2>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "8px", background: "var(--accent-forest-light)", border: "1.5px solid var(--accent-forest)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-forest)" }}>
            <StethoscopeIcon style={{ width: 20, height: 20 }} />
          </div>
        </div>

        {!showReset ? (
          <>
            <div className="auth-tabs">
              <TabButton
                label="Sign In"
                active={tab === "login"}
                onClick={() => setTab("login")}
              />
              <TabButton
                label="New Patient Register"
                active={tab === "signup"}
                onClick={() => setTab("signup")}
              />
            </div>

            {tab === "login" ? <LoginForm /> : <SignupForm />}

            {tab === "login" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowReset(true)}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  Forgot password?
                </button>
                <span className="text-muted" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                  256-Bit SSL Encrypted
                </span>
              </div>
            )}
          </>
        ) : (
          <ResetForm onBack={() => setShowReset(false)} />
        )}
      </div>
    </div>
  );
}
