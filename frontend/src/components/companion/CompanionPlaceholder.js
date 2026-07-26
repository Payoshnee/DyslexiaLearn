import React from "react";

function CompanionPlaceholder({ state }) {
  return (
    <div className="companion-placeholder" aria-live="polite">
      <div className="companion-avatar" aria-hidden="true">
        {state.textOnly ? "Text" : "3D"}
      </div>
      <div>
        <p className="companion-eyebrow">Learning Companion</p>
        <p className="companion-status">State: {state.status}</p>
        <p className="companion-message">{state.message || "Ready to learn"}</p>
        {state.reducedMotion && <p className="companion-note">Reduced motion is on</p>}
      </div>
    </div>
  );
}

export default CompanionPlaceholder;
