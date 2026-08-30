"use client";

import { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction, updateAvatarAction } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Image from "next/image";
import type { Profile, AuthFormState } from "@/types";

interface ProfileSettingsFormProps {
  profile: Profile;
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-primary"
      disabled={pending}
      style={{ alignSelf: "flex-start", padding: "0.75rem 2rem", borderRadius: "99px" }}
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const [state, formAction] = useFormState(updateProfileAction, {});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 2MB) and type
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }

    if (!supabase) {
      setUploadError("Supabase connection not initialized");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}/avatar_${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Save public URL to profile database
      const result = await updateAvatarAction(publicUrl);
      if (result.error) throw new Error(result.error);

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const initials = getInitials(profile.full_name);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        
        {/* Profile Picture Section */}
        <GlassPanel style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Profile Picture</h3>
          
          <div 
            onClick={handleAvatarClick}
            style={{
              position: "relative",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              cursor: "pointer",
              overflow: "hidden",
              border: "3px solid var(--accent-aqua)",
              background: "rgba(110, 231, 222, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            className="avatar-container"
          >
            {avatarUrl ? (
              <Image 
                src={avatarUrl} 
                alt={profile.full_name} 
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "2.5rem", fontWeight: 600, color: "var(--accent-aqua)" }}>
                {initials}
              </span>
            )}
            
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "0.75rem",
              padding: "0.375rem 0",
              textAlign: "center",
              opacity: 0,
              transition: "opacity 0.2s ease",
            }}
            className="avatar-overlay"
            >
              {uploading ? "Uploading..." : "Change"}
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            disabled={uploading}
          />

          <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0, maxWidth: "240px" }}>
            Click the avatar to upload a new profile picture. JPG, PNG or WEBP (Max 2MB).
          </p>

          {uploadError && (
            <p className="form-error" role="alert" style={{ fontSize: "0.8125rem", margin: 0 }}>
              {uploadError}
            </p>
          )}
        </GlassPanel>

        {/* Profile Info Form */}
        <GlassPanel style={{ padding: "2.5rem" }}>
          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>Personal Information</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-field">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input 
                  id="fullName"
                  name="fullName"
                  type="text"
                  defaultValue={profile.full_name}
                  required
                  className="glass-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input 
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone || ""}
                  required
                  className="glass-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="address">Address</label>
              <textarea 
                id="address"
                name="address"
                defaultValue={profile.address || ""}
                required
                rows={3}
                className="glass-input"
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
    </div>
  );
}
