import {
  Brain,
  Code2,
  Database,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useDoodle } from "../../companion/DoodleContext.js";
import BrainSettings from "./BrainSettings.jsx";
import {
  clearLogs,
  logEvent,
  subscribeToLogs,
} from "../../services/developerLogger.js";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "brain", label: "Brain", icon: Brain },
  { id: "data", label: "Data", icon: Database },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "developer", label: "Developer mode", icon: Code2 },
];

export default function SettingsPanel({ open, onClose }) {
  const { profile, setProfile } = useDoodle();
  const [section, setSection] = useState("profile");
  const [profileDraft, setProfileDraft] = useState(profile || {});
  const [logs, setLogs] = useState([]);
  const [logService, setLogService] = useState("all");
  const [developerEnabled, setDeveloperEnabled] = useState(
    () => localStorage.getItem("dyslexialearn_developer") === "true",
  );
  const [saved, setSaved] = useState("");

  useEffect(() => subscribeToLogs(setLogs), []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  const visibleLogs = useMemo(
    () => logs.filter((entry) => logService === "all" || entry.service === logService),
    [logs, logService],
  );
  const errors = useMemo(() => logs.filter((entry) => entry.level === "error"), [logs]);

  if (!open) return null;

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile({ ...profile, ...profileDraft });
    setSaved("Profile saved");
    logEvent("frontend", "success", "Learner profile updated");
  };

  return (
    <div className="settings-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-dialog" role="dialog" aria-modal="true" aria-label="Settings">
        <header className="settings-header">
          <div>
            <p className="eyebrow">Doodle controls</p>
            <h2>Settings</h2>
          </div>
          <button type="button" className="settings-close" onClick={onClose} aria-label="Close settings"><X /></button>
        </header>

        <div className="settings-layout">
          <nav className="settings-sidebar" aria-label="Settings sections">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className={section === id ? "active" : ""} onClick={() => { setSection(id); setSaved(""); }}>
                <Icon size={18} /><span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-content">
            {section === "profile" && (
              <form className="settings-form" onSubmit={saveProfile}>
                <div><p className="eyebrow">Learner</p><h3>Profile</h3><p>Personalize how the Doodle teaches and speaks.</p></div>
                <label>Name<input value={profileDraft.name || ""} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} /></label>
                <label>Age<input type="number" min="4" max="99" value={profileDraft.age || ""} onChange={(e) => setProfileDraft({ ...profileDraft, age: Number(e.target.value) })} /></label>
                <button className="settings-primary" type="submit">Save profile</button>
              </form>
            )}

            {section === "brain" && (
              <BrainSettings />
            )}

            {section === "data" && (
              <div className="settings-form"><div><p className="eyebrow">Storage</p><h3>Data</h3><p>Your learner profile and preferences are stored in this browser.</p></div><div className="settings-info-card"><strong>Local learner data</strong><span>Profile, selected brain, appearance, and learning preferences.</span></div><button type="button" className="settings-danger" onClick={() => { localStorage.removeItem("dyslexialearn_brain"); setSaved("Brain preference cleared"); }}>Clear saved brain preference</button></div>
            )}

            {section === "security" && (
              <div className="settings-form"><div><p className="eyebrow">Privacy</p><h3>Security</h3><p>Review what this experience can access.</p></div><div className="settings-info-card"><strong>Microphone</strong><span>Used only after you press Speak to Doodle. Chrome controls permission.</span></div><div className="settings-info-card"><strong>API keys</strong><span>Secrets must stay in backend environment variables and are never stored here.</span></div><div className="settings-info-card"><strong>Speech recognition</strong><span>Chrome's native speech recognition processes microphone speech.</span></div></div>
            )}

            {section === "developer" && (
              <div className="settings-form developer-panel">
                <div><p className="eyebrow">Diagnostics</p><h3>Developer mode</h3><p>Watch live browser and API events without exposing credentials.</p></div>
                <label className="settings-switch"><input type="checkbox" checked={developerEnabled} onChange={(e) => { setDeveloperEnabled(e.target.checked); localStorage.setItem("dyslexialearn_developer", String(e.target.checked)); logEvent("frontend", "info", `Developer mode ${e.target.checked ? "enabled" : "disabled"}`); }} />Enable developer mode</label>
                <div className="log-toolbar"><label>Service<select value={logService} onChange={(e) => setLogService(e.target.value)}><option value="all">All services</option><option value="frontend">Frontend</option><option value="backend">Backend</option><option value="api">API</option><option value="custom">Custom</option></select></label><button type="button" onClick={clearLogs}>Clear logs</button></div>
                <div className="log-console" aria-live="polite">{developerEnabled ? (visibleLogs.length ? visibleLogs.map((entry) => <div key={entry.id} className={`log-line log-${entry.level}`}><time>{new Date(entry.time).toLocaleTimeString()}</time><b>{entry.service}</b><span>{entry.message}</span>{entry.details && <small>{entry.details}</small>}</div>) : <p>No activity for this service yet.</p>) : <p>Enable developer mode to view live logs.</p>}</div>
                <div className="error-console"><div className="error-console-title"><strong>Errors</strong><span>{errors.length}</span></div>{developerEnabled && errors.length ? errors.slice(-20).reverse().map((entry) => <div key={entry.id}><time>{new Date(entry.time).toLocaleTimeString()}</time><span>{entry.message}</span><small>{entry.details}</small></div>) : <p>No errors captured.</p>}</div>
              </div>
            )}
            {saved && <p className="settings-saved" role="status">{saved}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
