import { CheckCircle2, Cloud, Cpu, LoaderCircle, Server, XCircle } from "lucide-react";
import { useState } from "react";

import { logEvent } from "../../services/developerLogger.js";
import { testBrainConnection } from "../../services/companionApi.js";

const BRAIN_TYPES = [
  { id: "dybrain", name: "DyBrain", description: "Use our managed brain and simply choose a model.", icon: Cpu },
  { id: "cloud", name: "Cloud Brain", description: "Connect a hosted AI provider using its credentials.", icon: Cloud },
  { id: "local", name: "Local Brain", description: "Run a private model on this computer or local network.", icon: Server },
];

const DY_MODELS = ["qwen2.5vl:3b"];
const PROVIDERS = {
  cloud: {
    ollama: { name: "Ollama Cloud", endpoint: "https://ollama.com", model: "gpt-oss:120b-cloud", key: true },
    azure: { name: "Azure OpenAI", endpoint: "https://YOUR-RESOURCE.openai.azure.com/openai/deployments", model: "YOUR-DEPLOYMENT", key: true, azure: true },
    google: { name: "Google Gemini", endpoint: "https://generativelanguage.googleapis.com/v1beta/models", model: "gemini-2.5-flash", key: true, project: true },
    claude: { name: "Claude", endpoint: "https://api.anthropic.com/v1/models", model: "claude-sonnet-4-5", key: true },
    custom: { name: "Custom cloud", endpoint: "https://provider.example/v1", model: "model-name", key: true },
  },
  local: {
    ollama: { name: "Ollama", endpoint: "http://localhost:11434", model: "qwen2.5:7b-instruct" },
    lmstudio: { name: "LM Studio", endpoint: "http://localhost:1234/v1", model: "local-model" },
    other: { name: "Other local server", endpoint: "http://localhost:8000/v1", model: "local-model" },
    custom: { name: "Custom", endpoint: "http://localhost:8000/v1", model: "model-name", key: true },
  },
};

function savedBrain() {
  try {
    return JSON.parse(localStorage.getItem("dyslexialearn_brain")) || {};
  } catch {
    return {};
  }
}

export default function BrainSettings() {
  const saved = savedBrain();
  const [type, setType] = useState(saved.brainType || "dybrain");
  const [providerId, setProviderId] = useState(saved.provider || "ollama");
  const [form, setForm] = useState(saved);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const provider = type === "dybrain" ? null : (PROVIDERS[type][providerId] || Object.values(PROVIDERS[type])[0]);
  const value = (key) => form[key] ?? provider?.[key] ?? "";
  const update = (key, next) => { setForm((current) => ({ ...current, [key]: next })); setResult(null); };
  const chooseType = (nextType) => {
    setType(nextType);
    setProviderId("ollama");
    setForm({ brainType: nextType, provider: "ollama" });
    setResult(null);
  };
  const chooseProvider = (nextId) => {
    const next = PROVIDERS[type][nextId];
    setProviderId(nextId);
    setForm({ brainType: type, provider: nextId, endpoint: next.endpoint, model: next.model });
    setResult(null);
  };

  const save = () => {
    const { apiKey, ...safeForm } = form;
    const savedConfig = { ...safeForm, brainType: type, provider: providerId };
    localStorage.setItem("dyslexialearn_brain", JSON.stringify(savedConfig));
    window.dispatchEvent(new CustomEvent("dyslexialearn:brain-changed", { detail: savedConfig }));
    setResult({ connected: true, message: "Brain preference saved. Secret keys were not stored." });
    logEvent("custom", "success", `${type}/${providerId} brain preference saved`);
  };

  const test = async () => {
    setTesting(true);
    setResult(null);
    try {
      const response = await testBrainConnection({
        brainType: type,
        provider: type === "dybrain" ? "ollama" : providerId,
        endpoint: type === "dybrain" ? "" : value("endpoint"),
        model: value("model") || DY_MODELS[0],
        apiKey: form.apiKey || "",
        apiVersion: form.apiVersion || "2024-10-21",
        deployment: form.deployment || "",
        projectId: form.projectId || "",
        location: form.location || "",
      });
      setResult(response);
    } catch (error) {
      setResult({ connected: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="settings-form brain-settings">
      <div><p className="eyebrow">AI provider</p><h3>Choose the Doodle's brain</h3><p>Select where the model runs, provide only what that provider needs, then test it.</p></div>
      <div className="brain-type-grid">
        {BRAIN_TYPES.map(({ id, name, description, icon: Icon }) => <button key={id} type="button" className={`brain-type-card ${type === id ? "active" : ""}`} onClick={() => chooseType(id)}><Icon size={21} /><strong>{name}</strong><span>{description}</span></button>)}
      </div>

      {type === "dybrain" ? (
        <div className="brain-fields"><label>DyBrain model<select value={form.model || DY_MODELS[0]} onChange={(e) => update("model", e.target.value)}>{DY_MODELS.map((model) => <option key={model}>{model}</option>)}</select></label><div className="settings-info-card"><strong>No provider setup required</strong><span>Choose a model and test whether it is currently available on the DyBrain server.</span></div></div>
      ) : (
        <div className="brain-fields">
          <div className="provider-grid">{Object.entries(PROVIDERS[type]).map(([id, item]) => <button key={id} type="button" className={`provider-card ${providerId === id ? "active" : ""}`} onClick={() => chooseProvider(id)}><strong>{item.name}</strong></button>)}</div>
          <label>Server URL<input value={value("endpoint")} onChange={(e) => update("endpoint", e.target.value)} placeholder="Provider base URL" /></label>
          <label>{provider?.azure ? "Deployment / model name" : "Model name"}<input value={value("model")} onChange={(e) => update("model", e.target.value)} /></label>
          {provider?.key && <label>API key<input type="password" autoComplete="off" value={form.apiKey || ""} onChange={(e) => update("apiKey", e.target.value)} placeholder="Used once for this connection test" /><small>For security, this key is never saved in local storage or logs.</small></label>}
          {provider?.azure && <label>Azure API version<input value={form.apiVersion || "2024-10-21"} onChange={(e) => update("apiVersion", e.target.value)} /></label>}
          {provider?.project && <div className="inline-fields"><label>Project ID<input value={form.projectId || ""} onChange={(e) => update("projectId", e.target.value)} /></label><label>Location<input value={form.location || "global"} onChange={(e) => update("location", e.target.value)} /></label></div>}
          <div className="connection-guide"><h4>What {provider.name} needs</h4><ul><li>A reachable server URL from the backend.</li><li>The exact loaded model or deployment name.</li>{provider.key && <li>A valid API key with model access.</li>}<li>Cloud keys should be moved to backend environment variables after testing.</li></ul></div>
        </div>
      )}

      <div className="brain-actions"><button className="settings-primary" type="button" onClick={test} disabled={testing}>{testing ? <><LoaderCircle className="spin" size={17} /> Testing...</> : "Test connection"}</button><button type="button" onClick={save}>Save preference</button></div>
      {result && <div className={`connection-result ${result.connected ? "success" : "error"}`}>{result.connected ? <CheckCircle2 /> : <XCircle />}<div><strong>{result.connected ? "Connected" : "Not connected"}</strong><span>{result.message}</span>{result.models?.length > 0 && <small>{result.models.length} models detected</small>}</div></div>}
    </div>
  );
}
