import { BarChart3, Settings } from "lucide-react";
import { useState } from "react";

import SettingsPanel from "./SettingsPanel.jsx";

export default function TopBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="top-bar" aria-label="Doodle tools">
        <button type="button"><BarChart3 size={18} /><span>Stats</span></button>
        <button type="button" onClick={() => setSettingsOpen(true)}><Settings size={18} /><span>Settings</span></button>
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
