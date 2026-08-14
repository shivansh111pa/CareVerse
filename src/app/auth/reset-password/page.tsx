"use client";

import { useFormState, useFormStatus } from "react-dom";
import { LiquidSurface } from "@/components/layout/LiquidSurface";
import { updatePasswordAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/types";

const initialState: AuthFormState = {};

function UpdatePasswordButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Updating…" : "Update password"}
    </button>
  );
}

function ResetPasswordForm() {
  const [state, formAction] = useFormState(updatePasswordAction, initialState);

  return (
    <form action={formAction} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="form-field">
          <label className="form-label" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="glass-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="glass-input"
          />
        </div>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <UpdatePasswordButton />
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
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
        }}
      >
        <div className="glass-panel" style={{ padding: "2rem", maxWidth: 480, width: "100%" }}>
          <h1
            className="font-display"
            style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
          >
            Set a new password
          </h1>
          <p className="text-muted" style={{ marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
            Choose a strong password for your CareVerse account.
          </p>
          <ResetPasswordForm />
        </div>
      </main>
    </>
  );
}
