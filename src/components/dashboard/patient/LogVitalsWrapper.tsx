"use client";

import { useState } from "react";
import { LogVitalsModal } from "./LogVitalsModal";

export function LogVitalsWrapper({ patientId }: { patientId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn" 
        style={{ padding: "0.5rem 1rem", borderRadius: "99px", background: "var(--accent-aqua)", color: "#000", fontWeight: 600, border: "none", fontSize: "0.875rem" }}
      >
        Log Vitals
      </button>
      <LogVitalsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        onComplete={() => {
          // Simply refresh the page to fetch new vitals
          window.location.reload();
        }}
      />
    </>
  );
}
