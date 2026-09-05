"use client";

import { useState } from "react";
import { LogVitalsModal } from "./LogVitalsModal";

export function LogVitalsWrapper({ patientId }: { patientId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary" 
        style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
      >
        Log Health Vitals
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
