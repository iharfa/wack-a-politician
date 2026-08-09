// Anonymous, fire-and-forget analytics. A random UUID per device (localStorage)
// gives unique-player counts without collecting any personal data.

const DEVICE_KEY = "wap-device";

function deviceId(): string {
  try {
    let d = localStorage.getItem(DEVICE_KEY);
    if (!d) {
      d = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, d);
    }
    return d;
  } catch {
    return "unknown";
  }
}

export function track(kind: "play" | "usage" | "error", data: { mode?: string; duration?: number; detail?: string } = {}) {
  try {
    const body = JSON.stringify({ kind, device: deviceId(), ...data });
    // sendBeacon survives tab closes; keepalive fetch is the fallback
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {}
}

let initialized = false;

export function initTracking() {
  if (initialized) return;
  initialized = true;

  // app-usage heartbeat: count foreground time, flushed every minute and on hide
  let last = Date.now();
  const flush = () => {
    const secs = Math.round((Date.now() - last) / 1000);
    last = Date.now();
    if (secs >= 1) track("usage", { duration: Math.min(secs, 120) });
  };
  setInterval(() => {
    if (!document.hidden) flush();
  }, 60000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flush();
    else last = Date.now();
  });

  // error logging, capped per session so a render loop can't flood the table
  let errs = 0;
  const logErr = (detail: string) => {
    if (errs++ < 5) track("error", { detail: detail.slice(0, 500) });
  };
  window.addEventListener("error", (e) => logErr(`${e.message} @ ${e.filename ?? "?"}:${e.lineno ?? "?"}`));
  window.addEventListener("unhandledrejection", (e) => logErr(`unhandledrejection: ${String(e.reason).slice(0, 400)}`));
}
