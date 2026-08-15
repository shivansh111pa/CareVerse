"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LiquidGlassLayers } from "@/components/ui/LiquidGlassLayers";
import { useLiquidGlassSpotlight } from "@/hooks/useLiquidGlassSpotlight";
import {
  loginAction,
  signupAction,
  resetPasswordAction,
  googleSignInAction,
} from "@/app/actions/auth";
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
      style={{ flex: 1, borderRadius: 10, padding: "0.5rem 1rem" }}
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
    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Or</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
      </div>
      <form action={googleSignInAction}>
        <button
          type="submit"
          className="btn btn-ghost"
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
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
  const router = useRouter();
  const [state, formAction] = useFormState(loginAction, initialState);

  useEffect(() => {
    if (state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state?.redirectUrl]);

  return (
    <>
      <form key="login" action={formAction} className="auth-form-pane">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="glass-input"
              placeholder="you@example.com"
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
            idleLabel="Sign in"
            pendingLabel="Signing in…"
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </div>
      </form>
      <GoogleOAuthSection label="Continue with Google" />
    </>
  );
}

function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialState);

  return (
    <>
      <form key="signup" action={formAction} className="auth-form-pane">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="glass-input"
              placeholder="Your full name"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-phone">
              Phone <span className="text-muted">(optional)</span>
            </label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="glass-input"
              placeholder="+91 …"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="glass-input"
              placeholder="At least 6 characters"
            />
          </div>
          {state?.error && <p className="form-error" role="alert">{state.error}</p>}
          {state?.success && (
            <p className="form-success" role="status">{state.success}</p>
          )}
          <SubmitButton
            idleLabel="Create account"
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
          Enter your email and we&apos;ll send a Supabase password-reset link.
        </p>
        <div className="form-field">
          <label className="form-label" htmlFor="reset-email">
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="glass-input"
            placeholder="you@example.com"
          />
        </div>
        {state?.error && <p className="form-error" role="alert">{state.error}</p>}
        {state?.success && (
          <p className="form-success" role="status">{state.success}</p>
        )}
        <SubmitButton idleLabel="Send reset link" pendingLabel="Sending…" style={{ width: "100%" }} />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ width: "100%" }}
        >
          Back to sign in
        </button>
      </div>
    </form>
  );
}

export function AuthPanel() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<AuthTab>("login");
  const [showReset, setShowReset] = useState(false);
  const { ref, handlers } = useLiquidGlassSpotlight();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signup") setTab("signup");
    if (authParam === "login") setTab("login");
  }, [searchParams]);

  return (
    <div
      ref={ref}
      className="auth-panel-wrap liquid-glass"
      {...handlers}
    >
      <GlassPanel
        variant="auth"
        className="pop-in-delayed liquid-glass__panel"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "1.75rem",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <LiquidGlassLayers />
        <div className="liquid-glass__content">
        <p className="auth-portal-note text-muted">
          One portal for patients and doctors — sign in and we&apos;ll take you to
          the right dashboard.
        </p>
        {!showReset ? (
          <>
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                padding: "0.25rem",
                background: "rgba(0,0,0,0.15)",
                borderRadius: 12,
                marginBottom: "1.5rem",
              }}
            >
              <TabButton
                label="Log in"
                active={tab === "login"}
                onClick={() => setTab("login")}
              />
              <TabButton
                label="Sign up"
                active={tab === "signup"}
                onClick={() => setTab("signup")}
              />
            </div>

            {tab === "login" ? <LoginForm /> : <SignupForm />}

            {tab === "login" && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowReset(true)}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  fontSize: "0.8125rem",
                }}
              >
                Forgot password?
              </button>
            )}
          </>
        ) : (
          <ResetForm onBack={() => setShowReset(false)} />
        )}
        </div>
      </GlassPanel>
    </div>
  );
}
