"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSignIn, useSignUp, SignedIn, UserButton } from "@clerk/nextjs";
import { StethoscopeIcon } from "@/components/ui/Icons";

export function AuthPanel() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationType, setVerificationType] = useState<"signup" | "signin_2fa" | "signin_1fa">("signup");
  const [code, setCode] = useState("");

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "reset">("request");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signup") setTab("signup");
    if (authParam === "login") setTab("login");
  }, [searchParams]);

  // Live password validation rules
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMinLength = password.length >= 8;

  // Live email validation rules
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isGmailOrValidDomain = email.includes("@") && email.split("@")[1]?.includes(".");

  const strengthCount = [hasLower, hasUpper, hasNumber, hasSpecial, hasMinLength].filter(Boolean).length;
  const strengthColor =
    strengthCount <= 2 ? "#ef4444" : strengthCount <= 4 ? "#eab308" : "var(--accent-forest, #0b5a42)";
  const strengthLabel =
    strengthCount <= 2 ? "Weak" : strengthCount <= 4 ? "Medium" : "Strong";

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignInLoaded) return;
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        window.location.href = "/dashboard";
      } else if (result.status === "needs_second_factor") {
        setVerificationType("signin_2fa");
        const emailFactor = (result.supportedSecondFactors as any[])?.find(
          (f: any) => f.strategy === "email_code"
        );
        if (emailFactor) {
          await (signIn as any).prepareSecondFactor({ strategy: "email_code" });
        }
        setPendingVerification(true);
      } else if (result.status === "needs_first_factor") {
        setVerificationType("signin_1fa");
        const emailFactor = (result.supportedFirstFactors as any[])?.find(
          (f: any) => f.strategy === "email_code"
        );
        if (emailFactor) {
          await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId: emailFactor.emailAddressId });
        }
        setPendingVerification(true);
      } else {
        console.log("Sign in incomplete", result);
        setError("Sign in requires additional verification.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Sign Up
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignUpLoaded) return;
    setError(null);

    // Strict validation
    if (!isValidEmail) {
      setError("Please enter a valid email address containing '@' and a domain (e.g. user@gmail.com).");
      return;
    }
    if (!hasMinLength || !hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      setError("Please ensure your password meets all requirements (uppercase, lowercase, number, special character, 8+ characters).");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const names = fullName.trim().split(" ");
      const firstName = names[0] || "Patient";
      const lastName = names.slice(1).join(" ") || "";

      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationType("signup");
      setPendingVerification(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Verification OTP
  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (verificationType === "signup") {
        if (!isSignUpLoaded) return;
        const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
        if (completeSignUp.status === "complete") {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
          window.location.href = "/dashboard";
        } else {
          setError("Verification incomplete. Please check the code.");
        }
      } else if (verificationType === "signin_2fa") {
        if (!isSignInLoaded) return;
        const completeSignIn = await (signIn as any).attemptSecondFactor({ strategy: "email_code", code });
        if (completeSignIn.status === "complete") {
          await setSignInActive({ session: completeSignIn.createdSessionId });
          window.location.href = "/dashboard";
        } else {
          setError("Second factor verification incomplete.");
        }
      } else if (verificationType === "signin_1fa") {
        if (!isSignInLoaded) return;
        const completeSignIn = await (signIn as any).attemptFirstFactor({ strategy: "email_code", code });
        if (completeSignIn.status === "complete") {
          await setSignInActive({ session: completeSignIn.createdSessionId });
          window.location.href = "/dashboard";
        } else {
          setError("Verification incomplete.");
        }
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Incorrect verification code.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Google OAuth
  function handleGoogleAuth() {
    if (tab === "signup" && isSignUpLoaded) {
      signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } else if (isSignInLoaded) {
      signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    }
  }

  // Handle Forgot Password Request
  async function handleForgotRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignInLoaded) return;
    setError(null);
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: forgotEmail,
      });
      setForgotStep("reset");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Reset Password Submit
  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignInLoaded) return;
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: forgotCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        setForgotSuccess(true);
        await setSignInActive({ session: result.createdSessionId });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

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

        {/* If user is already signed in */}
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

        {/* If user is signed out */}
        {!pendingVerification && tab !== "forgot" && (
          <>
            <div className="auth-tabs" style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className="btn btn-ghost"
                data-active={tab === "login"}
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
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
                onClick={() => {
                  setTab("signup");
                  setError(null);
                }}
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

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  color: "#dc2626",
                  fontSize: "0.8125rem",
                  marginBottom: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="login-email">
                    Patient / Doctor Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="glass-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "0.25rem", padding: "0.65rem" }}
                >
                  {loading ? "Signing In…" : "Sign In to Portal →"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setTab("forgot");
                      setForgotStep("request");
                      setError(null);
                    }}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    Forgot password?
                  </button>
                  <span className="text-muted" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                    256-Bit SSL Encrypted
                  </span>
                </div>
              </form>
            )}

            {/* SIGN UP FORM WITH LIVE VALIDATIONS */}
            {tab === "signup" && (
              <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="reg-name">
                    Patient Full Name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="glass-input"
                  />
                </div>

                {/* Email with live format checking */}
                <div className="form-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" htmlFor="reg-email">
                      Email Address
                    </label>
                    {email && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: isValidEmail ? "var(--accent-forest, #0b5a42)" : "#dc2626",
                        }}
                      >
                        {isValidEmail ? "✓ Valid format" : isGmailOrValidDomain ? "Incomplete domain" : "Requires @domain.com"}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="glass-input"
                    style={{
                      borderColor: email ? (isValidEmail ? "var(--accent-forest, #0b5a42)" : "#f87171") : undefined,
                    }}
                  />
                </div>

                {/* Password with live strength check */}
                <div className="form-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" htmlFor="reg-password">
                      Create Password
                    </label>
                    {password && (
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: strengthColor }}>
                        Strength: {strengthLabel}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="glass-input"
                  />

                  {/* Password Requirements Checklist */}
                  {password && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.55rem 0.65rem",
                        background: "var(--surface-subtle, #f3ede2)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle, #d8cebe)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: hasMinLength ? "var(--accent-forest, #0b5a42)" : "var(--text-muted)",
                          fontWeight: hasMinLength ? 700 : 500,
                        }}
                      >
                        <span>{hasMinLength ? "✓" : "○"}</span> At least 8 characters
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: hasLower ? "var(--accent-forest, #0b5a42)" : "var(--text-muted)",
                          fontWeight: hasLower ? 700 : 500,
                        }}
                      >
                        <span>{hasLower ? "✓" : "○"}</span> At least 1 lowercase letter (a-z)
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: hasUpper ? "var(--accent-forest, #0b5a42)" : "var(--text-muted)",
                          fontWeight: hasUpper ? 700 : 500,
                        }}
                      >
                        <span>{hasUpper ? "✓" : "○"}</span> At least 1 UPPERCASE letter (A-Z)
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: hasNumber ? "var(--accent-forest, #0b5a42)" : "var(--text-muted)",
                          fontWeight: hasNumber ? 700 : 500,
                        }}
                      >
                        <span>{hasNumber ? "✓" : "○"}</span> At least 1 number (0-9)
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: hasSpecial ? "var(--accent-forest, #0b5a42)" : "var(--text-muted)",
                          fontWeight: hasSpecial ? 700 : 500,
                        }}
                      >
                        <span>{hasSpecial ? "✓" : "○"}</span> At least 1 special character (!@#$%^&*)
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" htmlFor="reg-confirm">
                      Confirm Password
                    </label>
                    {confirmPassword && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: password === confirmPassword ? "var(--accent-forest, #0b5a42)" : "#dc2626",
                        }}
                      >
                        {password === confirmPassword ? "✓ Match" : "Passwords do not match"}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "0.4rem", padding: "0.65rem" }}
                >
                  {loading ? "Creating Account…" : "Create Patient Account →"}
                </button>
              </form>
            )}

            {/* Google OAuth Section */}
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: "1.5px", background: "var(--border-subtle)" }}></div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 700,
                  }}
                >
                  Or continue with
                </span>
                <div style={{ flex: 1, height: "1.5px", background: "var(--border-subtle)" }}></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="btn btn-secondary"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.65rem",
                  fontSize: "0.875rem",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {tab === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>
            </div>
          </>
        )}

        {/* VERIFICATION OTP STEP */}
        {pendingVerification && (
          <form onSubmit={handleVerification} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-forest, #0b5a42)" }}>
                {verificationType === "signup" ? "Verify Your Email" : "Security Verification"}
              </h3>
              <p className="text-muted" style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                {verificationType === "signup" ? (
                  <>We sent a 6-digit code to <strong>{email}</strong>. Enter it below to complete registration:</>
                ) : (
                  <>Please enter the 6-digit security code sent to <strong>{email}</strong> to complete sign in:</>
                )}
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  color: "#dc2626",
                  fontSize: "0.8125rem",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="otp-code">
                6-Digit Verification Code
              </label>
              <input
                id="otp-code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                placeholder="123456"
                className="glass-input"
                style={{ textAlign: "center", fontSize: "1.25rem", letterSpacing: "0.25em", fontWeight: 700 }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.75rem" }}
            >
              {loading ? "Verifying…" : verificationType === "signup" ? "Complete Registration →" : "Verify & Sign In →"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setPendingVerification(false);
                setError(null);
              }}
              style={{ width: "100%", fontSize: "0.8125rem" }}
            >
              {verificationType === "signup" ? "← Back to Registration" : "← Back to Sign In"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD STEP */}
        {tab === "forgot" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-forest, #0b5a42)" }}>
                Reset Your Password
              </h3>
              <p className="text-muted" style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>
                {forgotStep === "request"
                  ? "Enter your account email to receive a password reset code."
                  : `Enter the verification code sent to ${forgotEmail} and choose a new password.`}
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  color: "#dc2626",
                  fontSize: "0.8125rem",
                }}
              >
                {error}
              </div>
            )}

            {forgotSuccess ? (
              <div
                style={{
                  background: "var(--surface-cream, #f7f3ec)",
                  border: "1.5px solid var(--accent-forest, #0b5a42)",
                  padding: "1rem",
                  borderRadius: "8px",
                  color: "var(--accent-forest, #0b5a42)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                ✓ Password reset successfully! Redirecting to dashboard…
              </div>
            ) : forgotStep === "request" ? (
              <form onSubmit={handleForgotRequest} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="forgot-email">
                    Account Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.65rem" }}
                >
                  {loading ? "Sending Code…" : "Send Reset Code →"}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setTab("login");
                    setError(null);
                  }}
                  style={{ width: "100%", fontSize: "0.8125rem" }}
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="forgot-code">
                    Verification Code
                  </label>
                  <input
                    id="forgot-code"
                    type="text"
                    required
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    placeholder="Enter code from email"
                    className="glass-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="forgot-new-pwd">
                    New Password
                  </label>
                  <input
                    id="forgot-new-pwd"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.65rem" }}
                >
                  {loading ? "Resetting…" : "Update Password & Sign In →"}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setTab("login");
                    setError(null);
                  }}
                  style={{ width: "100%", fontSize: "0.8125rem" }}
                >
                  ← Cancel
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
