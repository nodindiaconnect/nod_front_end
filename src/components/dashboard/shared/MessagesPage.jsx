import React from "react";
import ChatWorkspace from "./ChatWorkspace";

export default function MessagesPage() {
  return (
    <div className="w-full py-2 px-3 sm:px-6 lg:px-10 sm:py-6">
      <div className="mb-4">
        <h1
          className="text-2xl sm:text-3xl font-bold text-heading"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Messages & Workspace Chat
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-0.5">
          Real-time pre-award negotiations, project team collaborations, and inquiries.
        </p>
      </div>

      <ChatWorkspace isEmbedded={false} />
    </div>
  );
}