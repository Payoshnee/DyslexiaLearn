import { BarChart3, Settings } from "lucide-react";

export default function TopBar() {
  return (
    <div className="top-bar" aria-label="Doodle tools">
      <button type="button">
        <BarChart3 size={18} />
        <span>Stats</span>
      </button>
      <button type="button">
        <Settings size={18} />
        <span>Settings</span>
      </button>
    </div>
  );
}
