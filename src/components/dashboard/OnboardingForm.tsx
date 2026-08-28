"use client";

import { useFormState, useFormStatus } from "react-dom";
import { onboardUserAction } from "@/app/actions/profile";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { AuthFormState } from "@/types";

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary"
      disabled={pending}
      style={{ width: "100%", marginTop: "1rem" }}
    >
      {pending ? "Saving profile..." : "Complete Setup"}
    </button>
  );
}

export function OnboardingForm() {
  const [state, formAction] = useFormState(onboardUserAction, initialState);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "1rem",
        background: "radial-gradient(circle at center, rgba(16, 24, 48, 1) 0%, rgba(8, 12, 24, 1) 100%)",
      }}
    >
      <GlassPanel
        variant="auth"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 className="font-display" style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            Welcome to CareVerse
          </h1>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Please complete your profile to access your dashboard.
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-field">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="glass-input"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className="glass-input"
              placeholder="Your complete residential or clinic address..."
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {state?.error && (
            <p className="form-error" role="alert" style={{ margin: 0 }}>
              {state.error}
            </p>
          )}

          {state?.success && (
            <p className="form-success" role="status" style={{ margin: 0 }}>
              {state.success}
            </p>
          )}

          <SubmitButton />
        </form>
      </GlassPanel>
    </div>
  );
}
