import { API_BASE_URL } from "../config";

const DEFAULT_TIMEOUT_MS = 15000;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);
  const token = localStorage.getItem("auth_token");

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = body?.message || body?.detail || "Request failed";
      throw new Error(message);
    }

    return body;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body || {}) }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body: JSON.stringify(body || {}) }),
};
