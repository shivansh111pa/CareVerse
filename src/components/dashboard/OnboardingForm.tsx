"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/dashboard";
    }
  }, [state?.success]);

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
              Phone Number (10 digits)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className="glass-input"
              placeholder="10-digit mobile number (e.g. 9876543210)"
              title="Mobile number must be exactly 10 digits"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
              }}
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
